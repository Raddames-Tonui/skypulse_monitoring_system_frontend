import { DataTable } from "@/components/table/DataTable";

type Props = {
    title: string;
    columns: any[];
    data: any[];
    isLoading?: boolean;
};

export default function ServiceTableSection({ title, columns, data, isLoading }: Props) {
    return (
        <section className="service-section">
            <DataTable columns={columns} data={data} isLoading={isLoading} enableFilter={false} enableSort={false} />
        </section>
    );
}
