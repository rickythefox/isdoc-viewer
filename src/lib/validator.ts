import type { ISDOCInvoice, ValidationError } from "../types/isdoc";

export class ISDOCValidator {
  validate(invoice: ISDOCInvoice): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required field validation
    if (!invoice.id) {
      errors.push({
        type: "error",
        messageKey: "validation.invoiceIdRequired",
        location: "Invoice/ID",
      });
    }

    if (!invoice.issueDate) {
      errors.push({
        type: "error",
        messageKey: "validation.issueDateRequired",
        location: "Invoice/IssueDate",
      });
    }

    if (!invoice.accountingSupplierParty.party.partyName?.name) {
      errors.push({
        type: "error",
        messageKey: "validation.supplierRequired",
        location: "Invoice/AccountingSupplierParty",
      });
    }

    if (invoice.legalMonetaryTotal.payableAmount <= 0) {
      errors.push({
        type: "warning",
        messageKey: "validation.payableAmountPositive",
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
        messageKey: "validation.totalsMismatch",
        messageParams: {
          calculated: calculatedTotal.toFixed(2),
          invoiceTotal:
            invoice.legalMonetaryTotal.taxInclusiveAmount.toFixed(2),
        },
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
