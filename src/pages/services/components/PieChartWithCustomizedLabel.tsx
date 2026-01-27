import { Cell, Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#28a745", "#dc3545", "#ffc107"];

type PieData = {
    name: string;
    value: number;
};

export default function PieChartWithCustomizedLabel({ data }: { data: PieData[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div
            style={{
                width: "100%",
                height: 320,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ResponsiveContainer width={300} height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value: number, name: string) => {
                            const percent = total
                                ? ((value / total) * 100).toFixed(1)
                                : "0";
                            return [`${value} (${percent}%)`, name];
                        }}
                    />

                    <Legend
                        verticalAlign="bottom"
                        formatter={(name: string) => {
                            const item = data.find(d => d.name === name);
                            const percent = item && total
                                ? ((item.value / total) * 100).toFixed(1)
                                : "0";
                            return `${name} (${percent}%)`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
