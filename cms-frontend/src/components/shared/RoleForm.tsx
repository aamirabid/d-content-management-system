"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { createRole, updateRole, setRolePermissions } from "../../lib/api/role.api";
import { fetchPermissions } from "../../lib/api/permission.api";

const RoleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

type RoleFormValues = z.infer<typeof RoleSchema>;

function InnerRoleForm({ onSubmit }: { onSubmit: (v: RoleFormValues) => Promise<void> }) {
  const { register, handleSubmit, formState, watch, setValue } = useFormContext<RoleFormValues>();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedPerms = watch("permissions") || [];

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchPermissions(1, 100);
        setPermissions(data.data?.items || data.items || []);
      } catch (err) {
        console.error("Failed to load permissions:", err);
      } finally {
        setLoadingPerms(false);
      }
    };
    loadPermissions();
  }, []);

  const togglePermission = (permId: string) => {
    const newPerms = selectedPerms.includes(permId)
      ? selectedPerms.filter((p: string) => p !== permId)
      : [...selectedPerms, permId];
    setValue("permissions", newPerms, { shouldValidate: true, shouldDirty: true });
  };

  const handleSubmitWrapped = async (values: RoleFormValues) => {
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWrapped)} className="space-y-4">
      <Input label="Role Name" {...register("name")} />
      <Input label="Description" {...register("description")} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
        {loadingPerms ? (
          <p className="text-gray-500">Loading permissions...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded">
            {permissions.map((perm: any) => (
              <label key={perm.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPerms.includes(String(perm.id))}
                  onChange={() => togglePermission(String(perm.id))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{perm.key}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </form>
  );
}

export function RoleForm({ initialValues, onSaved }: { initialValues?: Partial<RoleFormValues>; onSaved?: () => void }) {
  const coercedDefaults = {
    ...(initialValues as any),
    permissions: (initialValues?.permissions || []).map((p: any) => String(p)),
  } as any;

  const methods = useForm<RoleFormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: coercedDefaults,
  });

  const submit = async (values: RoleFormValues) => {
    try {
      // Always exclude permissions from role creation/update payload
      const { permissions, ...roleData } = values;
      
      let res: any;
      if (values.id) {
        // Update existing role
        res = await updateRole(values.id, roleData);
      } else {
        // Create new role
        res = await createRole(roleData);
      }
      
      // Set permissions separately
      const roleId = (res?.data?.id) || (res?.id) || values.id;
      if (roleId && permissions && permissions.length > 0) {
        await setRolePermissions(roleId as string, permissions.map(String) as string[]);
      }
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Failed to save role:", err);
      throw err;
    }
  };

  return (
    <FormProvider {...methods}>
      <InnerRoleForm onSubmit={submit} />
    </FormProvider>
  );
}
