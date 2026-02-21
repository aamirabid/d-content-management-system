"use client";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBlog, updateBlog } from "../api/blog";

const TranslationSchema = z.object({
  languageCode: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
});

const BlogSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  status: z.string().optional(),
  publishedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  translations: z.array(TranslationSchema).optional(),
});

export type BlogFormValues = z.infer<typeof BlogSchema>;

export function useBlogForm(
  initialValues: Partial<BlogFormValues> = {},
  onSuccess?: (data: any) => void,
) {
  const resolver = zodResolver(BlogSchema);
  const methods = useForm<BlogFormValues>({
    resolver,
    defaultValues: initialValues as any,
  });

  const submit = useCallback(
    async (values: BlogFormValues) => {
      if (values.id) {
        const res = await updateBlog(values.id, values as any);
        if (onSuccess) onSuccess(res);
        return res;
      } else {
        const res = await createBlog(values as any);
        if (onSuccess) onSuccess(res);
        return res;
      }
    },
    [onSuccess],
  );

  return useMemo(() => ({ methods, submit }), [methods, submit]);
}
