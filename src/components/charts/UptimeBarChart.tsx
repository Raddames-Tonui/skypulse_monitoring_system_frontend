import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from "recharts";

type UptimeLog = {
  name: string;    
  status: "UP" | "DOWN" | "MAINTENANCE";
};

const COLORS = {
  UP: "#28a745",
  DOWN: "#dc3545",
  MAINTENANCE: "#ffc107",
};

export default function UptimeBarChart({ data }: { data: UptimeLog[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis hide={true} /> 
        <Tooltip
          formatter={(value: string, name: string, props) => {
            return [value, "Status"];
          }}
        />
        <Bar dataKey="status">
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
