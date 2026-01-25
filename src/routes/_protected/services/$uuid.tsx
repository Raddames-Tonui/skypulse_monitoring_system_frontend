import { createFileRoute, redirect, type SearchSchemaInput } from "@tanstack/react-router";
import SingleServicePage from "@/pages/services/SingleServicePage.tsx";
import Loader from "@components/layout/Loader.tsx";

type ServiceSearch = {
  tab: 'overview' | 'incidents' | 'maintenance' | 'logs' | 'charts';
}

export const Route = createFileRoute('/_protected/services/$uuid')({
  component: SingleServicePage,
  loader: async () => {},
  pendingComponent: () => <Loader />,

  validateSearch: (search: Record<string, unknown> & SearchSchemaInput): ServiceSearch => {
    return {
      tab: (search.tab as ServiceSearch['tab']) || 'overview',
    }
  },
  beforeLoad: ({ search, params }) => {
    if (!search.tab) {
      throw redirect({
        to: Route.fullPath,
        params,
        search: { tab: 'overview' },
        replace: true,
      })
    }
  },
});
