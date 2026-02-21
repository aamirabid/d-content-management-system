import { AdminLayout } from "../../../src/components/layout/AdminLayout";
import { PermissionList } from "../../../src/components/shared/PermissionList.client";

export default function PermissionsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
          <p className="text-gray-600 mt-1">Manage system permissions and access controls</p>
        </div>
        <PermissionList />
      </div>
    </AdminLayout>
  );
}
