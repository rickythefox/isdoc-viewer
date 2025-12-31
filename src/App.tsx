import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionBar } from "./components/ActionBar";
import { FileUploader } from "./components/FileUploader";
import { InvoiceViewer } from "./components/InvoiceViewer";
import { LanguageSelector } from "./components/LanguageSelector";
import { ValidationErrors } from "./components/ValidationErrors";
import { parseISDOC } from "./lib/parser";
import { validateISDOC } from "./lib/validator";
import type { ISDOCInvoice, ValidationError } from "./types/isdoc";

function App() {
  const { t } = useTranslation();
  const [invoice, setInvoice] = useState<ISDOCInvoice | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileLoad = (content: string) => {
    try {
      setParseError(null);
      const parsed = parseISDOC(content);
      const errors = validateISDOC(parsed);

      setInvoice(parsed);
      setValidationErrors(errors);
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : t("errors.unknownParsing"),
      );
      setInvoice(null);
      setValidationErrors([]);
    }
  };

  const handleReset = () => {
    setInvoice(null);
    setValidationErrors([]);
    setParseError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center no-print relative">
          {/* Language selector - top right */}
          <div className="absolute top-0 right-0">
            <LanguageSelector />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t("header.title")}
          </h1>
          <p className="text-gray-600">{t("header.subtitle")}</p>
        </header>

        {/* Privacy notice */}
        <div className="mb-6 bg-blue-50 border border-blue-400 p-4 no-print">
          <div className="flex justify-center items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                🔒 {t("footer.privacy")}
              </p>
            </div>
          </div>
        </div>

        {parseError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 no-print">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  role="img"
                  aria-label="Error icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {t("errors.loadingFailed")}
                </h3>
                <div className="mt-2 text-sm text-red-700">{parseError}</div>
              </div>
            </div>
          </div>
        )}

        {!invoice ? (
          <FileUploader onFileLoad={handleFileLoad} />
        ) : (
          <>
            <ActionBar invoiceId={invoice.id} onReset={handleReset} />
            <ValidationErrors errors={validationErrors} />
            <InvoiceViewer invoice={invoice} />
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500 no-print">
          made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/richardginzburg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Richard Ginzburg
          </a>{" "}
          and 🤖 Claude
        </footer>
      </div>
    </div>
  );
}

export default App;
