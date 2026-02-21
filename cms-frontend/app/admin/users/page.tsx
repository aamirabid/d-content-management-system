import { AdminLayout } from "../../../src/components/layout/AdminLayout";
import { UserList } from "../../../src/components/shared/UserList.client";

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage system users and their roles</p>
          </div>
        </div>
        <UserList />
      </div>
    </AdminLayout>
  );
}
