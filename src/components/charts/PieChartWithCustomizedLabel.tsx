import { Cell, Pie, PieChart, Tooltip, Legend, PieProps } from "recharts";

const COLORS = ["#28a745", "#dc3545", "#ffc107"]; // Up, Down, Maintenance

type PieData = {
  name: string;
  value: number;
};

export default function PieChartWithLegendOnly({ data }: { data: PieData[] }) {
  return (
    <PieChart
      style={{ width: "100%", maxWidth: "500px", maxHeight: "80vh", aspectRatio: 1 }}
    >
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={120}
        label={false} // hide labels
      >
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip
        formatter={(value: number, name: string) => {
          const total = data.reduce((sum, item) => sum + item.value, 0);
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
          return [`${value} (${percent}%)`, name];
        }}
      />

      <Legend verticalAlign="bottom" />
    </PieChart>
  );
}
