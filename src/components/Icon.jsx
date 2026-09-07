import { memo } from 'react';

// Lucide's outline set stands in for the brand's icon set (see the design
// system's readme). Pinned to an exact version for a stable, cacheable URL.
const ICON_CDN = 'https://unpkg.com/lucide-static@0.544.0/icons/';

function Icon({ name, size = 24, color = 'currentColor', style, ...rest }) {
  const mask = `url("${ICON_CDN}${name}.svg") center / contain no-repeat`;

  return (
    <span
      aria-hidden="true"
      {...rest}
      style={{
        display: 'inline-block',
        flex: 'none',
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMask: mask,
        mask,
        ...style,
      }}
    />
  );
}

export default memo(Icon);
