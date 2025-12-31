import type React from "react";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "../i18n";
import type { LegalMonetaryTotal, TaxTotal } from "../types/isdoc";

interface TotalsSectionProps {
  monetaryTotal: LegalMonetaryTotal;
  taxTotal: TaxTotal;
  currency: string;
  showVAT: boolean;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  monetaryTotal,
  taxTotal,
  currency,
  showVAT,
}) => {
  const { t } = useTranslation();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(getDateLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="mb-6">
      <div className="max-w-md ml-auto">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("totals.taxBase")}:</span>
            <span className="font-medium">
              {formatAmount(monetaryTotal.taxExclusiveAmount)} {currency}
            </span>
          </div>

          {showVAT &&
            taxTotal.taxSubTotal.map((subtotal) => (
              <div
                key={`vat-${subtotal.taxCategory.percent}`}
                className="flex justify-between"
              >
                <span className="text-gray-600">
                  {t("totals.vat", { percent: subtotal.taxCategory.percent })}:
                </span>
                <span className="font-medium">
                  {formatAmount(subtotal.taxAmount)} {currency}
                </span>
              </div>
            ))}

          {monetaryTotal.paidDepositsAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.deposits")}:</span>
              <span className="font-medium">
                -{formatAmount(monetaryTotal.paidDepositsAmount)} {currency}
              </span>
            </div>
          )}

          <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-lg">
            <span className="font-semibold">{t("totals.total")}:</span>
            <span className="font-bold text-xl">
              {formatAmount(monetaryTotal.payableAmount)} {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
