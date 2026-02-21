"use client";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNews, updateNews } from "../api/news";

const TranslationSchema = z.object({
  languageCode: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
});

const NewsSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  status: z.string().optional(),
  publishedAt: z.string().optional(),
  translations: z.array(TranslationSchema).optional(),
  expiresAt: z.string().optional(),
});

export type NewsFormValues = z.infer<typeof NewsSchema>;

export function useNewsForm(
  initialValues: Partial<NewsFormValues> = {},
  onSuccess?: (data: any) => void,
) {
  const resolver = zodResolver(NewsSchema);
  const methods = useForm<NewsFormValues>({
    resolver,
    defaultValues: initialValues as any,
  });

  const submit = useCallback(
    async (values: NewsFormValues) => {
      if (values.id) {
        const res = await updateNews(values.id, values as any);
        if (onSuccess) onSuccess(res);
        return res;
      } else {
        const res = await createNews(values as any);
        if (onSuccess) onSuccess(res);
        return res;
      }
    },
    [onSuccess],
  );

  return useMemo(() => ({ methods, submit }), [methods, submit]);
}
