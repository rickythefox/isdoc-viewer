import type React from "react";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "../i18n";
import type { ISDOCInvoice } from "../types/isdoc";

interface InvoiceHeaderProps {
  invoice: ISDOCInvoice;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(getDateLocale());
  };

  const dueDate = invoice.paymentMeans.payment[0]?.details.paymentDueDate;

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">{t("invoice.title")}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">{t("invoice.number")}</div>
          <div className="text-lg font-semibold">{invoice.id}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">{t("invoice.uuid")}</div>
          <div className="text-sm font-mono">{invoice.uuid}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">{t("invoice.issueDate")}</div>
          <div className="font-medium">{formatDate(invoice.issueDate)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">{t("invoice.taxDate")}</div>
          <div className="font-medium">{formatDate(invoice.taxPointDate)}</div>
        </div>
        {dueDate && (
          <div>
            <div className="text-sm text-gray-600">{t("invoice.dueDate")}</div>
            <div className="font-medium text-red-600">
              {formatDate(dueDate)}
            </div>
          </div>
        )}
        <div>
          <div className="text-sm text-gray-600">{t("invoice.vatPayer")}</div>
          <div className="font-medium">
            {invoice.vatApplicable ? t("invoice.yes") : t("invoice.no")}
          </div>
        </div>
      </div>
      {invoice.issuingSystem && (
        <div className="mt-4 text-xs text-gray-500">
          {t("invoice.issuedBy")}: {invoice.issuingSystem}
        </div>
      )}
    </div>
  );
};
