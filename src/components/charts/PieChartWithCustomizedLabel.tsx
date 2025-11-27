import { Cell, Pie, PieChart } from "recharts";

const COLORS = ["#0b760eff", "#981b12ff", "#ffc518ff"]; 

export default function PieChartWithCustomizedLabel({ data }) {
  return (
    <PieChart style={{ width: "100%", maxWidth: "500px", maxHeight: "80vh", aspectRatio: 1 }}>
      <Pie
        data={data}
        nameKey="name"
        dataKey="value"
        label
        labelLine={false}
      >
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={COLORS[index]} />
        ))}
      </Pie>
    </PieChart>
  );
}
