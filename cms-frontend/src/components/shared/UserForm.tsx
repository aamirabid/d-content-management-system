"use client";
import React, { useEffect, useState } from "react";
import { useUserForm, UserFormValues } from "../../lib/hooks/useUserForm";
import { useFormContext, FormProvider } from "react-hook-form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { fetchRoles } from "../../lib/api/role.api";

function InnerForm({ onSubmit }: { onSubmit: (v: UserFormValues) => Promise<void> }) {
  const { register, handleSubmit, formState, watch, setValue } = useFormContext<UserFormValues>();
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedRoles = watch("roles") || [];

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles(1, 100);
        setRoles(data.data?.items || data.items || []);
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };
    loadRoles();
  }, []);

  // single-role selection: select one role at a time
  const toggleRole = (roleId: string) => {
    const currently = selectedRoles[0];
    const newRoles = currently === roleId ? [] : [roleId];
    setValue("roles", newRoles, { shouldValidate: true, shouldDirty: true });
  };

  const generatePassword = () => {
    const p = Math.random().toString(36).slice(-10) + "A1!";
    setValue("password" as any, p, { shouldValidate: true, shouldDirty: true });
  };

  const handleSubmitWrapped = async (values: UserFormValues) => {
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
      <Input label="First Name" {...register("firstName")} />
      <Input label="Last Name" {...register("lastName")} />
      <Input label="Email" type="email" {...register("email")} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
        {loadingRoles ? (
          <p className="text-gray-500">Loading roles...</p>
        ) : (
          <div className="space-y-2">
            {roles.map((role: any) => (
              <label key={role.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={selectedRoles[0] === role.id}
                  onChange={() => toggleRole(role.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{role.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="flex gap-2">
          <input type="text" {...register("password" as any)} className="w-full px-3 py-2 border rounded" />
          <button type="button" onClick={generatePassword} className="px-3 py-2 bg-gray-200 rounded">Generate</button>
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isActive")} className="w-4 h-4" />
        <span className="text-sm text-gray-700">Active</span>
      </label>

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
      {formState.errors && Object.keys(formState.errors).length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {Object.values(formState.errors).map((err: any) => (
            <p key={err.message}>{err.message}</p>
          ))}
        </div>
      )}
    </form>
  );
}

export function UserForm({ initialValues, onSaved }: { initialValues?: Partial<UserFormValues>; onSaved?: () => void }) {
  const { methods, submit } = useUserForm(initialValues || {}, () => {
    if (onSaved) onSaved();
  });

  return (
    <FormProvider {...methods}>
      <InnerForm onSubmit={async (v) => { await submit(v); }} />
    </FormProvider>
  );
}
