import { useState } from "react";

type JsonTreeViewProps = {
  data: any;
  name?: string;
  level?: number;
};

export default function TreeView({ data, name, level = 0 }: JsonTreeViewProps) {
  const [expanded, setExpanded] = useState(true);

  if (data === null || data === undefined) return <div className="ml-4">{name}: <em>null</em></div>;

  if (typeof data !== "object") {
    return (
      <div className="ml-4">
        {name ? <strong>{name}: </strong> : null}
        <span>{data.toString()}</span>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const keys = isArray ? data.map((_, i) => i.toString()) : Object.keys(data);

  return (
    <div className={`ml-${level * 4} border-l border-gray-200 pl-2`}>
      {name && (
        <div
          className="cursor-pointer select-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <strong>{name}</strong> {expanded ? "▼" : "▶"}
        </div>
      )}
      {expanded &&
        keys.map((key) => (
          <TreeView
            key={key}
            name={isArray ? `[${key}]` : key}
            data={data[key]}
            level={level + 1}
          />
        ))}
    </div>
  );
}
