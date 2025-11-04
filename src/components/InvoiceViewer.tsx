import type React from "react";
import type { ISDOCInvoice } from "../types/isdoc";
import { InvoiceHeader } from "./InvoiceHeader";
import { LineItemsTable } from "./LineItemsTable";
import { PartyPanel } from "./PartyPanel";
import { PaymentInfo } from "./PaymentInfo";
import { TotalsSection } from "./TotalsSection";

interface InvoiceViewerProps {
  invoice: ISDOCInvoice;
}

export const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoice }) => {
  return (
    <div
      id="invoice-viewer"
      className="bg-white p-8 shadow-lg max-w-5xl mx-auto"
    >
      <InvoiceHeader invoice={invoice} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PartyPanel party={invoice.accountingSupplierParty} title="Dodavatel" />
        <PartyPanel party={invoice.accountingCustomerParty} title="Odběratel" />
      </div>

      {invoice.note && (
        <div className="mb-6 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Poznámka</div>
          <div className="text-sm">{invoice.note}</div>
        </div>
      )}

      <LineItemsTable
        lines={invoice.invoiceLines}
        currency={invoice.localCurrencyCode}
        showVAT={invoice.vatApplicable}
      />

      <TotalsSection
        monetaryTotal={invoice.legalMonetaryTotal}
        taxTotal={invoice.taxTotal}
        currency={invoice.localCurrencyCode}
        showVAT={invoice.vatApplicable}
      />

      <PaymentInfo paymentMeans={invoice.paymentMeans} invoiceId={invoice.id} />
    </div>
  );
};
