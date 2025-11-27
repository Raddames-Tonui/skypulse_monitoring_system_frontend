import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function SimpleAreaChart({ data }) {
  return (
    <AreaChart
      style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
      data={data}
      margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
}
