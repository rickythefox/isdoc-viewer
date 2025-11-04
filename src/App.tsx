import { useState } from "react";
import { ActionBar } from "./components/ActionBar";
import { FileUploader } from "./components/FileUploader";
import { InvoiceViewer } from "./components/InvoiceViewer";
import { ValidationErrors } from "./components/ValidationErrors";
import { parseISDOC } from "./lib/parser";
import { validateISDOC } from "./lib/validator";
import type { ISDOCInvoice, ValidationError } from "./types/isdoc";

function App() {
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
        error instanceof Error ? error.message : "Neznámá chyba při parsování",
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
        <header className="mb-8 text-center no-print">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ISDOC Invoice Reader
          </h1>
          <p className="text-gray-600">
            Prohlížeč českých elektronických faktur ve formátu ISDOC 6.0.2
          </p>
        </header>

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
                  Chyba při načítání faktury
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
      </div>
    </div>
  );
}

export default App;
