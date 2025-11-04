import type React from "react";
import type { ISDOCInvoice } from "../types/isdoc";

interface InvoiceHeaderProps {
  invoice: ISDOCInvoice;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("cs-CZ");
  };

  const dueDate = invoice.paymentMeans.payment[0]?.details.paymentDueDate;

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">FAKTURA</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">Číslo faktury</div>
          <div className="text-lg font-semibold">{invoice.id}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">UUID</div>
          <div className="text-sm font-mono">{invoice.uuid}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Datum vystavení</div>
          <div className="font-medium">{formatDate(invoice.issueDate)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Datum zdanitelného plnění</div>
          <div className="font-medium">{formatDate(invoice.taxPointDate)}</div>
        </div>
        {dueDate && (
          <div>
            <div className="text-sm text-gray-600">Datum splatnosti</div>
            <div className="font-medium text-red-600">
              {formatDate(dueDate)}
            </div>
          </div>
        )}
        <div>
          <div className="text-sm text-gray-600">Plátce DPH</div>
          <div className="font-medium">
            {invoice.vatApplicable ? "Ano" : "Ne"}
          </div>
        </div>
      </div>
      {invoice.issuingSystem && (
        <div className="mt-4 text-xs text-gray-500">
          Vystaveno systémem: {invoice.issuingSystem}
        </div>
      )}
    </div>
  );
};
