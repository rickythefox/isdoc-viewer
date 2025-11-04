import { XMLParser } from "fast-xml-parser";
import type { ISDOCInvoice } from "../types/isdoc";

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true,
  removeNSPrefix: true, // Remove namespace prefixes
};

export class ISDOCParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser(parserOptions);
  }

  // Parse ISDOC XML string to typed object
  parse(xmlString: string): ISDOCInvoice {
    try {
      const parsed = this.parser.parse(xmlString);
      const invoice = parsed.Invoice;

      if (!invoice) {
        throw new Error("Invalid ISDOC format: Invoice root element not found");
      }

      return this.mapToISDOCInvoice(invoice);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse ISDOC XML: ${error.message}`);
      }
      throw error;
    }
  }

  // Map parsed XML object to ISDOCInvoice interface
  private mapToISDOCInvoice(invoice: any): ISDOCInvoice {
    // Helper function to safely get value or undefined
    const getValue = (obj: any, defaultValue?: any) => {
      if (obj === undefined || obj === null || obj === "") return defaultValue;
      return obj;
    };

    return {
      documentType: getValue(invoice.DocumentType, ""),
      id: getValue(invoice.ID, ""),
      uuid: getValue(invoice.UUID, ""),
      issuingSystem: getValue(invoice.IssuingSystem, ""),
      issueDate: getValue(invoice.IssueDate, ""),
      taxPointDate: getValue(invoice.TaxPointDate, ""),
      vatApplicable:
        invoice.VATApplicable === "true" || invoice.VATApplicable === true,
      electronicPossibilityAgreementReference: getValue(
        invoice.ElectronicPossibilityAgreementReference,
      ),
      note: getValue(invoice.Note),
      localCurrencyCode: getValue(invoice.LocalCurrencyCode, "CZK"),
      currRate: parseFloat(getValue(invoice.CurrRate, "1")),
      refCurrRate: parseFloat(getValue(invoice.RefCurrRate, "1")),
      accountingSupplierParty: this.mapParty(invoice.AccountingSupplierParty),
      accountingCustomerParty: this.mapParty(invoice.AccountingCustomerParty),
      invoiceLines: this.mapInvoiceLines(invoice.InvoiceLines),
      taxTotal: this.mapTaxTotal(invoice.TaxTotal),
      legalMonetaryTotal: this.mapLegalMonetaryTotal(
        invoice.LegalMonetaryTotal,
      ),
      paymentMeans: this.mapPaymentMeans(invoice.PaymentMeans),
    };
  }

  private mapParty(accountingParty: any): any {
    const party = accountingParty?.Party || {};
    return {
      party: {
        partyIdentification: {
          id: party.PartyIdentification?.ID,
        },
        partyName: {
          name: party.PartyName?.Name,
        },
        postalAddress: {
          streetName: party.PostalAddress?.StreetName,
          buildingNumber: party.PostalAddress?.BuildingNumber,
          cityName: party.PostalAddress?.CityName,
          postalZone: party.PostalAddress?.PostalZone,
          country: {
            identificationCode:
              party.PostalAddress?.Country?.IdentificationCode,
            name: party.PostalAddress?.Country?.Name,
          },
        },
        registerIdentification: party.RegisterIdentification
          ? {
              preformatted: party.RegisterIdentification.Preformatted,
            }
          : undefined,
        contact: party.Contact
          ? {
              name: party.Contact.Name,
              telephone: party.Contact.Telephone,
              electronicMail: party.Contact.ElectronicMail,
            }
          : undefined,
      },
    };
  }

  private mapInvoiceLines(invoiceLines: any): any[] {
    const lines = invoiceLines?.InvoiceLine;
    const linesArray = Array.isArray(lines) ? lines : lines ? [lines] : [];

    return linesArray.map((line: any) => ({
      id: line.ID || "",
      invoicedQuantity: parseFloat(line.InvoicedQuantity || "0"),
      lineExtensionAmount: parseFloat(line.LineExtensionAmount || "0"),
      lineExtensionAmountTaxInclusive: parseFloat(
        line.LineExtensionAmountTaxInclusive || "0",
      ),
      lineExtensionTaxAmount: parseFloat(line.LineExtensionTaxAmount || "0"),
      unitPrice: parseFloat(line.UnitPrice || "0"),
      unitPriceTaxInclusive: parseFloat(line.UnitPriceTaxInclusive || "0"),
      classifiedTaxCategory: {
        percent: parseFloat(line.ClassifiedTaxCategory?.Percent || "0"),
        vatCalculationMethod: parseInt(
          line.ClassifiedTaxCategory?.VATCalculationMethod || "0",
          10,
        ),
        vatApplicable:
          line.ClassifiedTaxCategory?.VATApplicable === "true" ||
          line.ClassifiedTaxCategory?.VATApplicable === true,
      },
      item: line.Item
        ? {
            description: line.Item.Description,
          }
        : undefined,
    }));
  }

  private mapTaxTotal(taxTotal: any): any {
    const subtotals = taxTotal?.TaxSubTotal;
    const subtotalsArray = Array.isArray(subtotals)
      ? subtotals
      : subtotals
        ? [subtotals]
        : [];

    return {
      taxSubTotal: subtotalsArray.map((sub: any) => ({
        taxableAmount: parseFloat(sub.TaxableAmount || "0"),
        taxAmount: parseFloat(sub.TaxAmount || "0"),
        taxInclusiveAmount: parseFloat(sub.TaxInclusiveAmount || "0"),
        alreadyClaimedTaxableAmount: parseFloat(
          sub.AlreadyClaimedTaxableAmount || "0",
        ),
        alreadyClaimedTaxAmount: parseFloat(sub.AlreadyClaimedTaxAmount || "0"),
        alreadyClaimedTaxInclusiveAmount: parseFloat(
          sub.AlreadyClaimedTaxInclusiveAmount || "0",
        ),
        differenceTaxableAmount: parseFloat(sub.DifferenceTaxableAmount || "0"),
        differenceTaxAmount: parseFloat(sub.DifferenceTaxAmount || "0"),
        differenceTaxInclusiveAmount: parseFloat(
          sub.DifferenceTaxInclusiveAmount || "0",
        ),
        taxCategory: {
          percent: parseFloat(sub.TaxCategory?.Percent || "0"),
          vatApplicable:
            sub.TaxCategory?.VATApplicable === "true" ||
            sub.TaxCategory?.VATApplicable === true,
          localReverseChargeFlag:
            sub.TaxCategory?.LocalReverseChargeFlag === "true" ||
            sub.TaxCategory?.LocalReverseChargeFlag === true,
        },
      })),
      taxAmount: parseFloat(taxTotal?.TaxAmount || "0"),
    };
  }

  private mapLegalMonetaryTotal(total: any): any {
    return {
      taxExclusiveAmount: parseFloat(total?.TaxExclusiveAmount || "0"),
      taxInclusiveAmount: parseFloat(total?.TaxInclusiveAmount || "0"),
      alreadyClaimedTaxExclusiveAmount: parseFloat(
        total?.AlreadyClaimedTaxExclusiveAmount || "0",
      ),
      alreadyClaimedTaxInclusiveAmount: parseFloat(
        total?.AlreadyClaimedTaxInclusiveAmount || "0",
      ),
      differenceTaxExclusiveAmount: parseFloat(
        total?.DifferenceTaxExclusiveAmount || "0",
      ),
      differenceTaxInclusiveAmount: parseFloat(
        total?.DifferenceTaxInclusiveAmount || "0",
      ),
      payableRoundingAmount: parseFloat(total?.PayableRoundingAmount || "0"),
      paidDepositsAmount: parseFloat(total?.PaidDepositsAmount || "0"),
      payableAmount: parseFloat(total?.PayableAmount || "0"),
    };
  }

  private mapPaymentMeans(paymentMeans: any): any {
    const payments = paymentMeans?.Payment;
    const paymentsArray = Array.isArray(payments)
      ? payments
      : payments
        ? [payments]
        : [];

    return {
      payment: paymentsArray.map((payment: any) => ({
        paidAmount: parseFloat(payment.PaidAmount || "0"),
        paymentMeansCode: payment.PaymentMeansCode || "",
        details: {
          paymentDueDate: payment.Details?.PaymentDueDate || "",
          id: payment.Details?.ID || "",
          bankCode: payment.Details?.BankCode || "",
          name: payment.Details?.Name || "",
          iban: payment.Details?.IBAN || "",
          bic: payment.Details?.BIC || "",
          variableSymbol: payment.Details?.VariableSymbol,
          constantSymbol: payment.Details?.ConstantSymbol,
          specificSymbol: payment.Details?.SpecificSymbol,
        },
      })),
    };
  }
}

export const parseISDOC = (xmlString: string): ISDOCInvoice => {
  const parser = new ISDOCParser();
  return parser.parse(xmlString);
};
