"use client";
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { createPermission, updatePermission } from "../../lib/api/permission.api";

const PermissionSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1, "Permission key is required"),
  description: z.string().optional(),
});

type PermissionFormValues = z.infer<typeof PermissionSchema>;

function InnerPermissionForm({ onSubmit }: { onSubmit: (v: PermissionFormValues) => Promise<void> }) {
  const { register, handleSubmit, formState } = useFormContext<PermissionFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Permission Key" {...register("key")} placeholder="e.g., blog.create" />
      <Input label="Description" {...register("description")} />

      <div className="flex gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
      {Object.keys(formState.errors).length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {Object.values(formState.errors).map((err: any) => (
            <p key={err.message}>{err.message}</p>
          ))}
        </div>
      )}
    </form>
  );
}

export function PermissionForm({ initialValues, onSaved }: { initialValues?: Partial<PermissionFormValues>; onSaved?: () => void }) {
  const methods = useForm<PermissionFormValues>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: initialValues as any,
  });

  const submit = async (values: PermissionFormValues) => {
    try {
      if (values.id) {
        await updatePermission(values.id, values);
      } else {
        await createPermission(values);
      }
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Failed to save permission:", err);
      throw err;
    }
  };

  return (
    <FormProvider {...methods}>
      <InnerPermissionForm onSubmit={submit} />
    </FormProvider>
  );
}
