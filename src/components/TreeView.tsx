import { useState } from "react";

type TreeViewProps = {
  data: any;
  name?: string;
  level?: number;
  highlightChanges?: boolean;
};

export default function TreeView({ data, name, level = 0, highlightChanges = false }: TreeViewProps) {
  const [expanded, setExpanded] = useState(level < 1);

  const indent = `${level * 4}`;

  if (data === null || data === undefined)
    return (
      <div className={`ml-${indent} text-gray-400`} title="null or undefined">
        {name && <strong>{name}: </strong>}
        <em>null</em>
      </div>
    );

  if (typeof data !== "object") {
    const isChanged = highlightChanges && typeof data === "string" && data.includes("!!"); // optional
    return (
      <div className={`ml-${indent} ${isChanged ? "bg-yellow-100 font-bold rounded px-1" : ""}`}>
        {name && <strong>{name}: </strong>}
        <span>{data.toString()}</span>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const keys = isArray ? data.map((_, i) => i.toString()) : Object.keys(data);

  const isEmpty = keys.length === 0;

  return (
    <div className={`ml-${indent} border-l border-gray-200 pl-2`}>
      {name && (
        <div
          className={`cursor-pointer select-none flex items-center gap-1 ${isEmpty ? "text-gray-400 italic" : "text-gray-700 hover:text-gray-900"}`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="text-sm">{expanded ? "▼" : "▶"}</span>
          <strong>{name}</strong>
          <span className="text-xs text-gray-400">
            {isArray ? `[${keys.length}]` : `{${keys.length}}`}
          </span>
          {isEmpty && <span className="ml-1 text-gray-400">(empty)</span>}
        </div>
      )}
      {expanded && !isEmpty && keys.map((key) => (
        <TreeView
          key={key}
          name={isArray ? `[${key}]` : key}
          data={isArray ? data[parseInt(key)] : data[key]}
          level={level + 1}
          highlightChanges={highlightChanges}
        />
      ))}
    </div>
  );
}
