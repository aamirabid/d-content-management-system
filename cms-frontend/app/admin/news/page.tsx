import { AdminLayout } from "../../../src/components/layout/AdminLayout";
import { NewsList } from "../../../src/components/shared/NewsList.client";

export default function NewsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600 mt-1">Manage news articles and publications</p>
        </div>
        <NewsList />
      </div>
    </AdminLayout>
  );
}
