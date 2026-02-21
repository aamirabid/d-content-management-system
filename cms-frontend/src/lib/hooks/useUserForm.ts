"use client";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser, createUser } from "../api/user.api";

const UserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  roles: z.array(z.string()).optional(),
  password: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UserFormValues = z.infer<typeof UserSchema>;

export function useUserForm(
  initialValues: Partial<UserFormValues> = {},
  onSuccess?: (data: any) => void,
) {
  const resolver = zodResolver(UserSchema);
  const methods = useForm<UserFormValues>({
    resolver,
    defaultValues: initialValues as any,
  });

  const submit = useCallback(
    async (values: UserFormValues) => {
      const id = values.id as string | undefined;
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roles: values.roles,
        isActive: values.isActive,
        password: (values as any).password,
      };
      let res;
      if (id) {
        res = await updateUser(id, payload as any);
      } else {
        res = await createUser(payload as any);
      }
      if (onSuccess) onSuccess(res);
      return res;
    },
    [onSuccess],
  );

  return useMemo(() => ({ methods, submit }), [methods, submit]);
}
