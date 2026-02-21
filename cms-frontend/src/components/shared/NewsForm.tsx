"use client";
import React, { useState } from "react";
import { useFormContext, FormProvider } from "react-hook-form";
import { useNewsForm, NewsFormValues } from "../../lib/hooks/useNewsForm";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

function Inner({ onSubmit }: { onSubmit: (v: NewsFormValues) => Promise<void> }) {
  const { register, handleSubmit, formState, watch, setValue } = useFormContext<NewsFormValues>();
  const [languages, setLanguages] = useState<string[]>(["en", "ar"]);
  const [activeLang, setActiveLang] = useState<string>("en");
  const translations = watch("translations") || [];

  const handleAddLanguage = () => {
    const newLang = prompt("Enter language code (e.g., es, fr, de):");
    if (newLang) {
      setLanguages([...languages, newLang]);
      const newTranslations = [...(translations || [])];
      newTranslations.push({ languageCode: newLang, title: "", content: "" });
      setValue("translations", newTranslations);
      setActiveLang(newLang);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Slug" {...register("slug")} placeholder="unique-news-slug" />
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-900">Translations</h4>
          <Button type="button" variant="secondary" size="sm" onClick={handleAddLanguage}>
            + Add Language
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded ${activeLang === lang ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {(() => {
            const idx = languages.indexOf(activeLang);
            if (idx === -1) return null;
            const lang = activeLang;
            return (
              <div key={lang} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h5 className="font-medium text-gray-900 mb-3">{lang.toUpperCase()} Translation</h5>
                <Input label="Title" {...register(`translations.${idx}.title`)} placeholder="News title" className="text-gray-900" />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                  <textarea
                    {...register(`translations.${idx}.content`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    rows={6}
                    placeholder="Enter HTML content"
                  />
                </div>
                <input type="hidden" {...register(`translations.${idx}.languageCode`)} value={lang} />
              </div>
            );
          })()}
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            {...register("status")} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
          <input 
            type="datetime-local" 
            {...register("publishedAt", {
              setValueAs: (val: any) => {
                if (!val) return undefined;
                if (typeof val === 'string') {
                  if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
                    return val;
                  }
                  try {
                    const date = new Date(val);
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - offset * 60 * 1000);
                    return localDate.toISOString().slice(0, 16);
                  } catch (e) {
                    return val;
                  }
                }
                return val;
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expires At (Optional)</label>
          <input 
            type="datetime-local" 
            {...register("expiresAt", {
              setValueAs: (val: any) => {
                if (!val) return undefined;
                if (typeof val === 'string') {
                  if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
                    return val;
                  }
                  try {
                    const date = new Date(val);
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - offset * 60 * 1000);
                    return localDate.toISOString().slice(0, 16);
                  } catch (e) {
                    return val;
                  }
                }
                return val;
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save News"}
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

export function NewsForm({ initialValues, onSaved }: { initialValues?: Partial<NewsFormValues>; onSaved?: () => void }) {
  const { methods, submit } = useNewsForm(initialValues || {}, () => { if (onSaved) onSaved(); });
  const handleSubmitWrapped = async (v: NewsFormValues) => {
    // Convert datetime-local strings to ISO format
    let publishedAt = v.publishedAt;
    if (publishedAt && typeof publishedAt === 'string' && publishedAt.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
      publishedAt = new Date(publishedAt).toISOString();
    }
    
    let expiresAt = v.expiresAt;
    if (expiresAt && typeof expiresAt === 'string' && expiresAt.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
      expiresAt = new Date(expiresAt).toISOString();
    }
    
    const cleaned = {
      ...v,
      publishedAt,
      expiresAt,
      translations: (v.translations || []).filter((t: any) => t && t.title && t.content),
    } as NewsFormValues;
    await submit(cleaned as any);
  };

  return (
    <FormProvider {...methods}>
      <Inner onSubmit={handleSubmitWrapped} />
    </FormProvider>
  );
}
