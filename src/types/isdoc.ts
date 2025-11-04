export interface ISDOCInvoice {
  documentType: string;
  id: string;
  uuid: string;
  issuingSystem: string;
  issueDate: string;
  taxPointDate: string;
  vatApplicable: boolean;
  electronicPossibilityAgreementReference?: string;
  note?: string;
  localCurrencyCode: string;
  currRate: number;
  refCurrRate: number;
  accountingSupplierParty: AccountingParty;
  accountingCustomerParty: AccountingParty;
  invoiceLines: InvoiceLine[];
  taxTotal: TaxTotal;
  legalMonetaryTotal: LegalMonetaryTotal;
  paymentMeans: PaymentMeans;
}

export interface AccountingParty {
  party: Party;
}

export interface Party {
  partyIdentification?: {
    id?: string;
  };
  partyName?: {
    name?: string;
  };
  postalAddress: PostalAddress;
  registerIdentification?: {
    preformatted?: string;
  };
  contact?: Contact;
}

export interface PostalAddress {
  streetName?: string;
  buildingNumber?: string;
  cityName?: string;
  postalZone?: string;
  country?: {
    identificationCode?: string;
    name?: string;
  };
}

export interface Contact {
  name?: string;
  telephone?: string;
  electronicMail?: string;
}

export interface InvoiceLine {
  id: string;
  invoicedQuantity: number;
  lineExtensionAmount: number;
  lineExtensionAmountTaxInclusive: number;
  lineExtensionTaxAmount: number;
  unitPrice: number;
  unitPriceTaxInclusive: number;
  classifiedTaxCategory: ClassifiedTaxCategory;
  item?: {
    description?: string;
  };
}

export interface ClassifiedTaxCategory {
  percent: number;
  vatCalculationMethod: number;
  vatApplicable: boolean;
}

export interface TaxTotal {
  taxSubTotal: TaxSubTotal[];
  taxAmount: number;
}

export interface TaxSubTotal {
  taxableAmount: number;
  taxAmount: number;
  taxInclusiveAmount: number;
  alreadyClaimedTaxableAmount: number;
  alreadyClaimedTaxAmount: number;
  alreadyClaimedTaxInclusiveAmount: number;
  differenceTaxableAmount: number;
  differenceTaxAmount: number;
  differenceTaxInclusiveAmount: number;
  taxCategory: TaxCategory;
}

export interface TaxCategory {
  percent: number;
  vatApplicable: boolean;
  localReverseChargeFlag: boolean;
}

export interface LegalMonetaryTotal {
  taxExclusiveAmount: number;
  taxInclusiveAmount: number;
  alreadyClaimedTaxExclusiveAmount: number;
  alreadyClaimedTaxInclusiveAmount: number;
  differenceTaxExclusiveAmount: number;
  differenceTaxInclusiveAmount: number;
  payableRoundingAmount: number;
  paidDepositsAmount: number;
  payableAmount: number;
}

export interface PaymentMeans {
  payment: Payment[];
}

export interface Payment {
  paidAmount: number;
  paymentMeansCode: string;
  details: PaymentDetails;
}

export interface PaymentDetails {
  paymentDueDate: string;
  id: string;
  bankCode: string;
  name: string;
  iban: string;
  bic: string;
  variableSymbol?: string;
  constantSymbol?: string;
  specificSymbol?: string;
}

export interface ValidationError {
  type: "error" | "warning";
  message: string;
  location?: string;
}
