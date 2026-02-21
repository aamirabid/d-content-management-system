import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";
import { useLanguage } from "../../context/LanguageContext";

const dicts: Record<string, any> = { en, ar };

export function getDict(lang: string) {
  return dicts[lang] || dicts.en;
}

export function useTranslation() {
  const { language } = useLanguage();
  const t = getDict(language);
  return { t, language };
}
