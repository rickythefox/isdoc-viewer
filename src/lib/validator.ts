import type { ISDOCInvoice, ValidationError } from "../types/isdoc";

export class ISDOCValidator {
  validate(invoice: ISDOCInvoice): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required field validation
    if (!invoice.id) {
      errors.push({
        type: "error",
        message: "Invoice ID is required",
        location: "Invoice/ID",
      });
    }

    if (!invoice.issueDate) {
      errors.push({
        type: "error",
        message: "Issue date is required",
        location: "Invoice/IssueDate",
      });
    }

    if (!invoice.accountingSupplierParty.party.partyName?.name) {
      errors.push({
        type: "error",
        message: "Supplier name is required",
        location: "Invoice/AccountingSupplierParty",
      });
    }

    if (invoice.legalMonetaryTotal.payableAmount <= 0) {
      errors.push({
        type: "warning",
        message: "Payable amount should be greater than zero",
        location: "Invoice/LegalMonetaryTotal/PayableAmount",
      });
    }

    // Consistency checks
    const calculatedTotal = invoice.invoiceLines.reduce(
      (sum, line) => sum + line.lineExtensionAmountTaxInclusive,
      0,
    );

    if (
      Math.abs(
        calculatedTotal - invoice.legalMonetaryTotal.taxInclusiveAmount,
      ) > 0.01
    ) {
      errors.push({
        type: "warning",
        message: `Line items total (${calculatedTotal}) doesn't match invoice total (${invoice.legalMonetaryTotal.taxInclusiveAmount})`,
        location: "Invoice/InvoiceLines",
      });
    }

    return errors;
  }
}

export const validateISDOC = (invoice: ISDOCInvoice): ValidationError[] => {
  const validator = new ISDOCValidator();
  return validator.validate(invoice);
};
