import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush
} from "recharts";

type Props = {
  data: any[];
  width?: number;
};

export default function SimpleAreaChart({ data, width = 2000 }: Props) {
  return (
      <div style={{ width, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#6366f1" fill="#6366f1" />
            <Brush dataKey="name" height={30} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
  );
}
