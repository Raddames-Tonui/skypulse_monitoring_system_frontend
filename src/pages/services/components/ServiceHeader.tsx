export type ServiceTab = "overview" | "charts" | "uptime" | "incidents" | "maintenance";

type Props = {
    name: string;
    tab: ServiceTab;
    setActiveTab: (tab: ServiceTab) => void | Promise<void>;
    tabs: readonly ServiceTab[];
};

export default function ServiceHeader({ name, tab, setActiveTab, tabs }: Props) {
    return (
        <div className="page-header">
            <h1>{name}</h1>
            <div className="tab-buttons">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={tab === t ? "tab-primary" : "tab-secondary"}
                        onClick={() => setActiveTab(t)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}
