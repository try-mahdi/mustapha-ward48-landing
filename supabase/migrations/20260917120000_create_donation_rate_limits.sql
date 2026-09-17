-- Backs the per-IP rate limit on the create-yoco-checkout Edge Function.
-- One row per rate-limit key (currently: client IP), holding a fixed-size
-- sliding window's start time and count.
create table if not exists public.donation_rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

-- No one but the service role (used only from the Edge Function) should
-- touch this table directly.
alter table public.donation_rate_limits enable row level security;

-- Atomically checks and increments the counter for `p_key`, resetting the
-- window if it's expired. Returns true if the caller is still under
-- `p_max_requests` for the current window, false if it should be rejected.
--
-- Runs as a single UPSERT so concurrent requests for the same key can't
-- race each other into both reading a stale count.
create or replace function public.check_donation_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_max_requests integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count integer;
begin
  insert into donation_rate_limits (key, window_start, count)
  values (p_key, v_now, 1)
  on conflict (key) do update
    set
      count = case
        when donation_rate_limits.window_start <= v_now - make_interval(secs => p_window_seconds)
          then 1
        else donation_rate_limits.count + 1
      end,
      window_start = case
        when donation_rate_limits.window_start <= v_now - make_interval(secs => p_window_seconds)
          then v_now
        else donation_rate_limits.window_start
      end
  returning count into v_count;

  return v_count <= p_max_requests;
end;
$$;
