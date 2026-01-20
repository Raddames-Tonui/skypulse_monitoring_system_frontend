import "@css/loader.css";

interface LoaderProps {
  size?: string | number;
  speed?: number;
  className?: string;
  ariaLabel?: string;
  showText?: boolean;
}

export default function Loader({
  size = "2em",
  speed = 1.4,
  className = "",
  ariaLabel = "Loading",
  showText = true,
}: LoaderProps) {
  const width =
    typeof size === "number" ? `${size}px` : size;

  const height =
    typeof size === "number"
      ? `${(size * 0.75).toFixed(2)}px`
      : `calc(${size} * 0.75)`; 

  const strokeWidth =
    typeof size === "number"
      ? Math.max(size * 0.0469, 2)
      : 3;

  return (
    <div
      className={`loading inline-block align-middle ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{ "--speed": `${speed}s` } as React.CSSProperties}
    >
      <svg width={width} height={height} viewBox="0 0 64 48">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="back"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="front"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      <div>
        {showText && <p className="loader-p">Loading...</p>}
      </div>
    </div>
  );
}