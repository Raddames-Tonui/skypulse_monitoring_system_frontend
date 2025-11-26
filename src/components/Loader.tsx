
interface LoaderProps {
  size?: string | number; 
  speed?: number;         
  className?: string;
  ariaLabel?: string;
}

export default function Loader({
  size = "2em",
  speed = 1.4,
  className = "",
  ariaLabel = "Loading",
}: LoaderProps) {
  // Convert size to string with px if number
  const width = typeof size === "number" ? `${size}px` : size;

  // Maintain 4:3 aspect ratio
  const height = typeof size === "number" ? `${(size * 0.75).toFixed(2)}px` : `0.75em`;

  // Stroke width scales with width
  const strokeWidth = typeof size === "number" ? Math.max(size * 0.0469, 2) : 3; 

  return (
    <div
      className={`loading inline-block align-middle ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg width={width} height={height} viewBox="0 0 64 48">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="back"
          strokeWidth={strokeWidth}
        />
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="front"
          strokeWidth={strokeWidth}
          style={{ animationDuration: `${speed}s` }}
        />
      </svg>

      <style>{`
        .loading svg polyline {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .loading svg polyline#back {
          stroke: #ff4d5033;
        }

        .loading svg polyline#front {
          stroke: #ff4d4f;
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          animation: dash ${speed}s linear infinite;
        }

        @keyframes dash {
          72.5% { opacity: 0; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
