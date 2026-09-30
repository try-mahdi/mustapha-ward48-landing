import { useId, useState } from 'react';
import './StreetSearch.css';

const MAX_SUGGESTIONS = 8;

const STATUS_LABELS = {
  in: 'In Ward 48',
  partly: 'Partly in Ward 48',
  out: 'Not in Ward 48',
};

// Built from OpenStreetMap: every named street in and around the ward,
// already classified against the 2026 boundary (see public/data). Fetched
// on first focus rather than bundled, so it costs nothing until someone
// actually searches — and what they type never leaves the browser.
let streetsPromise = null;
function loadStreets() {
  streetsPromise ??= fetch('/data/ward48-streets.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => data.streets)
    .catch((error) => {
      streetsPromise = null;
      throw error;
    });
  return streetsPromise;
}

function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function findStreets(streets, query) {
  const q = normalise(query);
  if (!q) return [];
  const starts = [];
  const contains = [];
  for (const street of streets) {
    const name = normalise(street.n);
    if (name.startsWith(q)) starts.push(street);
    else if (name.includes(q)) contains.push(street);
    if (starts.length >= MAX_SUGGESTIONS) break;
  }
  return starts.concat(contains).slice(0, MAX_SUGGESTIONS);
}

function StreetSearch({ onSelect, onNoMatch }) {
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState('');
  const [streets, setStreets] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = streets ? findStreets(streets, query) : [];
  const showList = open && suggestions.length > 0;

  function ensureLoaded() {
    if (streets) return;
    loadStreets()
      .then((data) => {
        setStreets(data);
        setLoadFailed(false);
      })
      .catch(() => setLoadFailed(true));
  }

  function choose(street) {
    setQuery(street.n);
    setOpen(false);
    setActive(-1);
    onSelect(street);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const pick = suggestions[active] ?? suggestions[0];
      if (pick) choose(pick);
      else if (streets && query.trim()) onNoMatch(query.trim());
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div className="street-search">
      <label htmlFor={`${id}-input`} className="street-search__label">
        Search your street
      </label>
      <div className="street-search__field">
        <input
          id={`${id}-input`}
          className="street-search__input"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. Thornton Road"
          value={query}
          onFocus={() => {
            ensureLoaded();
            setOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setOpen(false)}
        />

        {showList && (
          <ul id={listId} role="listbox" className="street-search__list">
            {suggestions.map((street, i) => (
              <li
                key={street.n}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={`street-search__option ${i === active ? 'is-active' : ''}`}
                // mousedown, not click: fires before the input's blur closes
                // the list.
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(street);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span>{street.n}</span>
                <span className={`street-search__badge street-search__badge--${street.s}`}>
                  {STATUS_LABELS[street.s]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {loadFailed && (
        <p className="street-search__error" role="alert">
          The street list didn&rsquo;t load. Check your connection, or tap your home on the map
          instead.
        </p>
      )}
    </div>
  );
}

export default StreetSearch;
