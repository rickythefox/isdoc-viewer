import { QRCodeSVG } from "qrcode.react";
import type React from "react";
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
  const payment = paymentMeans.payment[0];
  if (!payment) return null;

  const { details } = payment;
  const qrData = generateCzechQRPayment(payment, invoiceId);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("cs-CZ");
  };

  const formatIBAN = (iban: string) => {
    if (!iban) return "";
    // Remove existing spaces and add space every 4 characters
    return iban
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  return (
    <div className="border-t-2 pt-6">
      <h2 className="text-lg font-semibold mb-4">Platební údaje</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600">Datum splatnosti</div>
            <div className="text-lg font-semibold text-red-600">
              {formatDate(details.paymentDueDate)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Částka</div>
            <div className="text-lg font-semibold">
              {payment.paidAmount.toFixed(2)} CZK
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Číslo účtu</div>
            <div className="font-mono">
              {details.id}/{details.bankCode}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">IBAN</div>
            <div className="font-mono text-sm">{formatIBAN(details.iban)}</div>
          </div>

          {details.bic && (
            <div>
              <div className="text-sm text-gray-600">BIC</div>
              <div className="font-mono">{details.bic}</div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-600">Název banky</div>
            <div className="text-sm">{details.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {details.variableSymbol && (
              <div>
                <div className="text-sm text-gray-600">Var. symbol</div>
                <div className="font-semibold">{details.variableSymbol}</div>
              </div>
            )}

            {details.constantSymbol && (
              <div>
                <div className="text-sm text-gray-600">Konst. symbol</div>
                <div className="font-semibold">{details.constantSymbol}</div>
              </div>
            )}
          </div>

          {details.specificSymbol && (
            <div>
              <div className="text-sm text-gray-600">Spec. symbol</div>
              <div className="font-semibold">{details.specificSymbol}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-gray-600 mb-2">QR kód pro platbu</div>
          <div className="bg-white p-4 border-2 border-gray-300 rounded">
            <QRCodeSVG value={qrData} size={200} level="M" />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Naskenujte v mobilní bance
          </div>
        </div>
      </div>
    </div>
  );
};
