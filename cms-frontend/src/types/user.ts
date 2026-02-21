export type PermissionKey = string;

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roles?: string[];
  permissions?: PermissionKey[];
  isActive?: boolean;
};
