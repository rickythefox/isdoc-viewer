import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18n-lang", lang);
  };

  const isActive = (lang: string) => i18n.language === lang;

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => changeLanguage("cs")}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          isActive("cs")
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        CZ
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          isActive("en")
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        EN
      </button>
    </div>
  );
}
