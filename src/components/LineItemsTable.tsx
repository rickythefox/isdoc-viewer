import type React from "react";
import type { InvoiceLine } from "../types/isdoc";

interface LineItemsTableProps {
  lines: InvoiceLine[];
  currency: string;
  showVAT: boolean;
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  lines,
  currency,
  showVAT,
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Položky faktury</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Popis
            </th>
            <th className="border border-gray-300 px-4 py-2 text-right">
              Množství
            </th>
            <th className="border border-gray-300 px-4 py-2 text-right">
              Jedn. cena
            </th>
            {showVAT && (
              <th className="border border-gray-300 px-4 py-2 text-right">
                DPH %
              </th>
            )}
            <th className="border border-gray-300 px-4 py-2 text-right">
              Celkem
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id}>
              <td className="border border-gray-300 px-4 py-2">
                {line.item?.description || "Bez popisu"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {line.invoicedQuantity}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {formatAmount(line.unitPrice)} {currency}
              </td>
              {showVAT && (
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {line.classifiedTaxCategory.percent}%
                </td>
              )}
              <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                {formatAmount(line.lineExtensionAmountTaxInclusive)} {currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
