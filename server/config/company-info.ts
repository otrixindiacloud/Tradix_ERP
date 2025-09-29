/**
 * Golden Tag WLL Company Information Configuration
 * Complete company details for invoices, quotations, and official documents
 */

export interface CompanyInfo {
  name: string;
  arabicName?: string;
  registrationNumber: string;
  taxId: string;
  tradeLicenseNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
  };
  contact: {
    phone: string;
    mobile: string;
    fax: string;
    email: string;
    website: string;
  };
  banking: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    iban: string;
    swiftCode: string;
    currency: string;
  }[];
  legal: {
    companyRegistration: string;
    vatRegistration: string;
    chamberOfCommerce: string;
  };
  branding: {
    logoPath: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  defaultTermsAndConditions: {
    payment: string[];
    delivery: string[];
    returns: string[];
    warranty: string[];
    general: string[];
  };
}

export const GOLDEN_TAG_COMPANY_INFO: CompanyInfo = {
  name: "Golden Tag WLL",
  arabicName: "شركة الطابع الذهبي ذ.م.م",
  registrationNumber: "GT-WLL-2024-001",
  taxId: "100123456700003",
  tradeLicenseNumber: "CN-1234567",
  
  address: {
    street: "Building 123, Street 45, Industrial Area",
    city: "Doha",
    state: "Al Rayyan",
    postalCode: "12345",
    country: "Qatar",
    fullAddress: "Building 123, Street 45, Industrial Area\nDoha, Al Rayyan 12345\nState of Qatar"
  },
  
  contact: {
    phone: "+974 4444 5555",
    mobile: "+974 5555 6666",
    fax: "+974 4444 5556", 
    email: "info@goldentag.com.qa",
    website: "www.goldentag.com.qa"
  },
  
  banking: [
    {
      bankName: "Qatar National Bank (QNB)",
      accountName: "Golden Tag WLL",
      accountNumber: "0123456789012345",
      iban: "QA58QNBA000000000123456789012345",
      swiftCode: "QNBAQAQA",
      currency: "QAR"
    },
    {
      bankName: "Qatar National Bank (QNB)",
      accountName: "Golden Tag WLL",
      accountNumber: "0123456789012346",
      iban: "QA58QNBA000000000123456789012346", 
      swiftCode: "QNBAQAQA",
      currency: "USD"
    },
    {
      bankName: "Commercial Bank of Qatar (CBQ)",
      accountName: "Golden Tag WLL", 
      accountNumber: "0987654321098765",
      iban: "QA54CBQA000000000987654321098765",
      swiftCode: "CBQAQAQA",
      currency: "AED"
    }
  ],
  
  legal: {
    companyRegistration: "CR No: 123456",
    vatRegistration: "VAT No: 100123456700003",
    chamberOfCommerce: "QCC Membership: 987654321"
  },
  
  branding: {
    logoPath: "public/logo golden tag.jpg",
    primaryColor: "#D4AF37", // Golden color
    secondaryColor: "#1F2937", // Dark gray
    accentColor: "#059669" // Green for highlights
  },
  
  defaultTermsAndConditions: {
    payment: [
      "Payment terms: Net 30 days from invoice date",
      "Late payment charges: 2% per month on overdue amounts",
      "All payments to be made in the currency specified on this invoice",
      "Bank charges for international transfers to be borne by the customer",
      "No deductions or set-offs without prior written consent"
    ],
    delivery: [
      "Delivery terms as per agreed Incoterms",
      "Delivery dates are estimates and subject to product availability",
      "Customer to inspect goods upon delivery and report discrepancies within 48 hours",
      "Risk of loss passes to customer upon delivery",
      "Delivery charges additional unless otherwise specified"
    ],
    returns: [
      "Returns accepted within 30 days of delivery for manufacturing defects only",
      "Goods must be in original packaging and unused condition",
      "Return authorization required before shipping back",
      "Customer bears return shipping costs unless product is defective",
      "Restocking fee of 20% may apply for non-defective returns"
    ],
    warranty: [
      "Standard manufacturer warranty applies to all products",
      "Warranty claims to be processed directly with manufacturer",
      "Golden Tag WLL facilitates warranty claims but provides no additional warranty",
      "Warranty void if product modified or misused",
      "Software products sold with manufacturer license terms"
    ],
    general: [
      "This invoice is subject to Qatar laws and regulations",
      "Any disputes to be resolved through Qatar courts",
      "Prices valid for current transaction only",
      "Golden Tag WLL reserves right to modify terms with prior notice",
      "Customer data processed in accordance with Qatar Data Protection Law"
    ]
  }
};

/**
 * Get company information for different document types
 */
export function getCompanyInfoForDocument(documentType: 'invoice' | 'quotation' | 'delivery' | 'receipt'): CompanyInfo {
  // Currently returns the same info for all document types
  // Could be extended to customize based on document type
  return GOLDEN_TAG_COMPANY_INFO;
}

/**
 * Get banking information for a specific currency
 */
export function getBankingInfoForCurrency(currency: string): CompanyInfo['banking'][0] | null {
  const bankInfo = GOLDEN_TAG_COMPANY_INFO.banking.find(bank => bank.currency === currency);
  return bankInfo || GOLDEN_TAG_COMPANY_INFO.banking[0]; // Default to first bank if currency not found
}

/**
 * Get formatted company address
 */
export function getFormattedAddress(includeCountry: boolean = true): string {
  const addr = GOLDEN_TAG_COMPANY_INFO.address;
  if (includeCountry) {
    return addr.fullAddress;
  }
  return `${addr.street}\n${addr.city}, ${addr.state} ${addr.postalCode}`;
}

/**
 * Get formatted contact information
 */
export function getFormattedContactInfo(): string[] {
  const contact = GOLDEN_TAG_COMPANY_INFO.contact;
  return [
    `Tel: ${contact.phone}`,
    `Mobile: ${contact.mobile}`,
    `Email: ${contact.email}`,
    `Web: ${contact.website}`
  ];
}

/**
 * Get legal information formatted for documents
 */
export function getFormattedLegalInfo(): string[] {
  const legal = GOLDEN_TAG_COMPANY_INFO.legal;
  return [
    legal.companyRegistration,
    legal.vatRegistration,
    legal.chamberOfCommerce
  ];
}