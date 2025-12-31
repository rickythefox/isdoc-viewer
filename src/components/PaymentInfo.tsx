import { QRCodeSVG } from "qrcode.react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "../i18n";
import { generateCzechQRPayment } from "../lib/qr-generator";
import type { PaymentMeans } from "../types/isdoc";

interface PaymentInfoProps {
  paymentMeans: PaymentMeans;
  invoiceId: string;
}

export const PaymentInfo: React.FC<PaymentInfoProps> = ({
  paymentMeans,
  invoiceId,
}) => {
  const { t } = useTranslation();
  const payment = paymentMeans.payment[0];
  if (!payment) return null;

  const { details } = payment;
  const qrData = generateCzechQRPayment(payment, invoiceId);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(getDateLocale());
  };

  const formatIBAN = (iban: string) => {
    if (!iban) return "";
    return iban
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  return (
    <div className="border-t-2 pt-6">
      <h2 className="text-lg font-semibold mb-4">{t("payment.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600">{t("invoice.dueDate")}</div>
            <div className="text-lg font-semibold text-red-600">
              {formatDate(details.paymentDueDate)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">{t("totals.total")}</div>
            <div className="text-lg font-semibold">
              {payment.paidAmount.toFixed(2)} CZK
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">
              {t("payment.accountNumber")}
            </div>
            <div className="font-mono">
              {details.id}/{details.bankCode}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">{t("payment.iban")}</div>
            <div className="font-mono text-sm">{formatIBAN(details.iban)}</div>
          </div>

          {details.bic && (
            <div>
              <div className="text-sm text-gray-600">{t("payment.bic")}</div>
              <div className="font-mono">{details.bic}</div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-600">{t("payment.bankName")}</div>
            <div className="text-sm">{details.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {details.variableSymbol && (
              <div>
                <div className="text-sm text-gray-600">
                  {t("payment.variableSymbol")}
                </div>
                <div className="font-semibold">{details.variableSymbol}</div>
              </div>
            )}

            {details.constantSymbol && (
              <div>
                <div className="text-sm text-gray-600">
                  {t("payment.constantSymbol")}
                </div>
                <div className="font-semibold">{details.constantSymbol}</div>
              </div>
            )}
          </div>

          {details.specificSymbol && (
            <div>
              <div className="text-sm text-gray-600">
                {t("payment.specificSymbol")}
              </div>
              <div className="font-semibold">{details.specificSymbol}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-gray-600 mb-2">
            {t("payment.qrTitle")}
          </div>
          <div className="bg-white p-4 border-2 border-gray-300 rounded">
            <QRCodeSVG value={qrData} size={200} level="M" />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {t("payment.qrHint")}
          </div>
        </div>
      </div>
    </div>
  );
};
