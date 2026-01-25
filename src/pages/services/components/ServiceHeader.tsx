
type Props = {
    name: string;
    tab: string;
    setActiveTab: (tab: string) => void;
    tabs: string[];
    onEdit: () => void;
};

export default function ServiceHeader({ name, tab, setActiveTab, tabs, onEdit }: Props) {
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
            <button className="action-btn" onClick={onEdit}>
                Edit
            </button>
        </div>
    );
}
