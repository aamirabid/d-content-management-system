import { AdminLayout } from "../../../src/components/layout/AdminLayout";
import { RoleList } from "../../../src/components/shared/RoleList.client";

export default function RolesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <RoleList />
      </div>
    </AdminLayout>
  );
}
