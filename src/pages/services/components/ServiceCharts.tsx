import SimpleAreaChart from "@/pages/services/components/SimpleAreaChart";
import PieChartWithCustomizedLabel from "@/pages/services/components/PieChartWithCustomizedLabel";

type Props = {
    uptimePieData: { name: string; value: number }[];
    responseChartData: { name: string; uv: number }[];
};

export default function ServiceCharts({ uptimePieData, responseChartData }: Props) {
    return (
        <section className="service-section">
            <div className="charts-container">
                <div className="chart-card">
                    <h4>Uptime Status</h4>
                    <PieChartWithCustomizedLabel data={uptimePieData} />
                </div>
                <div className="chart-card">
                    <h4>Response Time Over Time</h4>
                    <SimpleAreaChart data={responseChartData} />
                </div>
            </div>
        </section>
    );
}
