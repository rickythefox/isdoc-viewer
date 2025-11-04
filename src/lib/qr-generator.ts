import type { Payment } from "../types/isdoc";

/**
 * Generate Czech QR payment code (Short Payment Descriptor)
 * Format: SPD*1.0*AM:amount*CC:currency*X-VS:variableSymbol*X-KS:constantSymbol*ACC:IBAN*MSG:message
 */
export function generateCzechQRPayment(
  payment: Payment,
  invoiceId: string,
): string {
  const { paidAmount, details } = payment;

  const parts: string[] = ["SPD", "1.0"];

  // Amount
  parts.push(`AM:${paidAmount.toFixed(2)}`);

  // Currency (always CZK for Czech payments)
  parts.push("CC:CZK");

  // IBAN
  if (details.iban) {
    // Remove spaces from IBAN
    const iban = details.iban.replace(/\s+/g, "");
    parts.push(`ACC:${iban}`);
  }

  // Variable symbol
  if (details.variableSymbol) {
    parts.push(`X-VS:${details.variableSymbol}`);
  }

  // Constant symbol
  if (details.constantSymbol) {
    parts.push(`X-KS:${details.constantSymbol}`);
  }

  // Specific symbol
  if (details.specificSymbol) {
    parts.push(`X-SS:${details.specificSymbol}`);
  }

  // Due date (in YYYYMMDD format)
  if (details.paymentDueDate) {
    const dueDate = details.paymentDueDate.replace(/-/g, "");
    parts.push(`DT:${dueDate}`);
  }

  // Message (invoice ID)
  parts.push(`MSG:Faktura ${invoiceId}`);

  return parts.join("*");
}
