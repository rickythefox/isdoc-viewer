import { XMLParser } from "fast-xml-parser";
import type {
  AccountingParty,
  InvoiceLine,
  ISDOCInvoice,
  LegalMonetaryTotal,
  PaymentMeans,
  TaxTotal,
} from "../types/isdoc";

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
  private mapToISDOCInvoice(invoice: unknown): ISDOCInvoice {
    // Helper function to safely get value or undefined
    const getValue = <T>(obj: T, defaultValue?: T): T | undefined => {
      if (obj === undefined || obj === null || obj === "") return defaultValue;
      return obj;
    };

    // Cast invoice to a record type for safe property access
    const inv = invoice as Record<string, unknown>;

    return {
      documentType: getValue(inv.DocumentType, "") as string,
      id: getValue(inv.ID, "") as string,
      uuid: getValue(inv.UUID, "") as string,
      issuingSystem: getValue(inv.IssuingSystem, "") as string,
      issueDate: getValue(inv.IssueDate, "") as string,
      taxPointDate: getValue(inv.TaxPointDate, "") as string,
      vatApplicable: inv.VATApplicable === "true" || inv.VATApplicable === true,
      electronicPossibilityAgreementReference: getValue(
        inv.ElectronicPossibilityAgreementReference,
      ) as string | undefined,
      note: getValue(inv.Note) as string | undefined,
      localCurrencyCode: getValue(inv.LocalCurrencyCode, "CZK") as string,
      currRate: parseFloat(getValue(inv.CurrRate, "1") as string),
      refCurrRate: parseFloat(getValue(inv.RefCurrRate, "1") as string),
      accountingSupplierParty: this.mapParty(inv.AccountingSupplierParty),
      accountingCustomerParty: this.mapParty(inv.AccountingCustomerParty),
      invoiceLines: this.mapInvoiceLines(inv.InvoiceLines),
      taxTotal: this.mapTaxTotal(inv.TaxTotal),
      legalMonetaryTotal: this.mapLegalMonetaryTotal(inv.LegalMonetaryTotal),
      paymentMeans: this.mapPaymentMeans(inv.PaymentMeans),
    };
  }

  private mapParty(accountingParty: unknown): AccountingParty {
    const ap = accountingParty as Record<string, unknown> | undefined;
    const party = (ap?.Party as Record<string, unknown>) || {};
    return {
      party: {
        partyIdentification: {
          id: (party.PartyIdentification as Record<string, unknown>)?.ID as
            | string
            | undefined,
        },
        partyName: {
          name: (party.PartyName as Record<string, unknown>)?.Name as
            | string
            | undefined,
        },
        postalAddress: {
          streetName: (party.PostalAddress as Record<string, unknown>)
            ?.StreetName as string | undefined,
          buildingNumber: (party.PostalAddress as Record<string, unknown>)
            ?.BuildingNumber as string | undefined,
          cityName: (party.PostalAddress as Record<string, unknown>)
            ?.CityName as string | undefined,
          postalZone: (party.PostalAddress as Record<string, unknown>)
            ?.PostalZone as string | undefined,
          country: {
            identificationCode: (
              (party.PostalAddress as Record<string, unknown>)
                ?.Country as Record<string, unknown>
            )?.IdentificationCode as string | undefined,
            name: (
              (party.PostalAddress as Record<string, unknown>)
                ?.Country as Record<string, unknown>
            )?.Name as string | undefined,
          },
        },
        registerIdentification: party.RegisterIdentification
          ? {
              preformatted: (
                party.RegisterIdentification as Record<string, unknown>
              ).Preformatted as string | undefined,
            }
          : undefined,
        contact: party.Contact
          ? {
              name: (party.Contact as Record<string, unknown>).Name as
                | string
                | undefined,
              telephone: (party.Contact as Record<string, unknown>).Telephone as
                | string
                | undefined,
              electronicMail: (party.Contact as Record<string, unknown>)
                .ElectronicMail as string | undefined,
            }
          : undefined,
      },
    };
  }

  private mapInvoiceLines(invoiceLines: unknown): InvoiceLine[] {
    const il = invoiceLines as Record<string, unknown> | undefined;
    const lines = il?.InvoiceLine;
    const linesArray = Array.isArray(lines) ? lines : lines ? [lines] : [];

    return linesArray.map((line: unknown) => {
      const l = line as Record<string, unknown>;
      return {
        id: (l.ID as string) || "",
        invoicedQuantity: parseFloat((l.InvoicedQuantity as string) || "0"),
        lineExtensionAmount: parseFloat(
          (l.LineExtensionAmount as string) || "0",
        ),
        lineExtensionAmountTaxInclusive: parseFloat(
          (l.LineExtensionAmountTaxInclusive as string) || "0",
        ),
        lineExtensionTaxAmount: parseFloat(
          (l.LineExtensionTaxAmount as string) || "0",
        ),
        unitPrice: parseFloat((l.UnitPrice as string) || "0"),
        unitPriceTaxInclusive: parseFloat(
          (l.UnitPriceTaxInclusive as string) || "0",
        ),
        classifiedTaxCategory: {
          percent: parseFloat(
            ((l.ClassifiedTaxCategory as Record<string, unknown>)
              ?.Percent as string) || "0",
          ),
          vatCalculationMethod: parseInt(
            ((l.ClassifiedTaxCategory as Record<string, unknown>)
              ?.VATCalculationMethod as string) || "0",
            10,
          ),
          vatApplicable:
            (l.ClassifiedTaxCategory as Record<string, unknown>)
              ?.VATApplicable === "true" ||
            (l.ClassifiedTaxCategory as Record<string, unknown>)
              ?.VATApplicable === true,
        },
        item: l.Item
          ? {
              description: (l.Item as Record<string, unknown>).Description as
                | string
                | undefined,
            }
          : undefined,
      };
    });
  }

  private mapTaxTotal(taxTotal: unknown): TaxTotal {
    const tt = taxTotal as Record<string, unknown> | undefined;
    const subtotals = tt?.TaxSubTotal;
    const subtotalsArray = Array.isArray(subtotals)
      ? subtotals
      : subtotals
        ? [subtotals]
        : [];

    return {
      taxSubTotal: subtotalsArray.map((sub: unknown) => {
        const s = sub as Record<string, unknown>;
        return {
          taxableAmount: parseFloat((s.TaxableAmount as string) || "0"),
          taxAmount: parseFloat((s.TaxAmount as string) || "0"),
          taxInclusiveAmount: parseFloat(
            (s.TaxInclusiveAmount as string) || "0",
          ),
          alreadyClaimedTaxableAmount: parseFloat(
            (s.AlreadyClaimedTaxableAmount as string) || "0",
          ),
          alreadyClaimedTaxAmount: parseFloat(
            (s.AlreadyClaimedTaxAmount as string) || "0",
          ),
          alreadyClaimedTaxInclusiveAmount: parseFloat(
            (s.AlreadyClaimedTaxInclusiveAmount as string) || "0",
          ),
          differenceTaxableAmount: parseFloat(
            (s.DifferenceTaxableAmount as string) || "0",
          ),
          differenceTaxAmount: parseFloat(
            (s.DifferenceTaxAmount as string) || "0",
          ),
          differenceTaxInclusiveAmount: parseFloat(
            (s.DifferenceTaxInclusiveAmount as string) || "0",
          ),
          taxCategory: {
            percent: parseFloat(
              ((s.TaxCategory as Record<string, unknown>)?.Percent as string) ||
                "0",
            ),
            vatApplicable:
              (s.TaxCategory as Record<string, unknown>)?.VATApplicable ===
                "true" ||
              (s.TaxCategory as Record<string, unknown>)?.VATApplicable ===
                true,
            localReverseChargeFlag:
              (s.TaxCategory as Record<string, unknown>)
                ?.LocalReverseChargeFlag === "true" ||
              (s.TaxCategory as Record<string, unknown>)
                ?.LocalReverseChargeFlag === true,
          },
        };
      }),
      taxAmount: parseFloat((tt?.TaxAmount as string) || "0"),
    };
  }

  private mapLegalMonetaryTotal(total: unknown): LegalMonetaryTotal {
    const t = total as Record<string, unknown> | undefined;
    return {
      taxExclusiveAmount: parseFloat((t?.TaxExclusiveAmount as string) || "0"),
      taxInclusiveAmount: parseFloat((t?.TaxInclusiveAmount as string) || "0"),
      alreadyClaimedTaxExclusiveAmount: parseFloat(
        (t?.AlreadyClaimedTaxExclusiveAmount as string) || "0",
      ),
      alreadyClaimedTaxInclusiveAmount: parseFloat(
        (t?.AlreadyClaimedTaxInclusiveAmount as string) || "0",
      ),
      differenceTaxExclusiveAmount: parseFloat(
        (t?.DifferenceTaxExclusiveAmount as string) || "0",
      ),
      differenceTaxInclusiveAmount: parseFloat(
        (t?.DifferenceTaxInclusiveAmount as string) || "0",
      ),
      payableRoundingAmount: parseFloat(
        (t?.PayableRoundingAmount as string) || "0",
      ),
      paidDepositsAmount: parseFloat((t?.PaidDepositsAmount as string) || "0"),
      payableAmount: parseFloat((t?.PayableAmount as string) || "0"),
    };
  }

  private mapPaymentMeans(paymentMeans: unknown): PaymentMeans {
    const pm = paymentMeans as Record<string, unknown> | undefined;
    const payments = pm?.Payment;
    const paymentsArray = Array.isArray(payments)
      ? payments
      : payments
        ? [payments]
        : [];

    return {
      payment: paymentsArray.map((payment: unknown) => {
        const p = payment as Record<string, unknown>;
        const details = p.Details as Record<string, unknown> | undefined;
        return {
          paidAmount: parseFloat((p.PaidAmount as string) || "0"),
          paymentMeansCode: (p.PaymentMeansCode as string) || "",
          details: {
            paymentDueDate: (details?.PaymentDueDate as string) || "",
            id: (details?.ID as string) || "",
            bankCode: (details?.BankCode as string) || "",
            name: (details?.Name as string) || "",
            iban: (details?.IBAN as string) || "",
            bic: (details?.BIC as string) || "",
            variableSymbol: details?.VariableSymbol as string | undefined,
            constantSymbol: details?.ConstantSymbol as string | undefined,
            specificSymbol: details?.SpecificSymbol as string | undefined,
          },
        };
      }),
    };
  }
}

export const parseISDOC = (xmlString: string): ISDOCInvoice => {
  const parser = new ISDOCParser();
  return parser.parse(xmlString);
};
