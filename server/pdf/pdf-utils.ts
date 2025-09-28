import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, InvoiceItem, Item, Customer, Quotation, QuotationItem } from '@shared/schema';

// Core reusable interfaces
export interface PdfGenerateResult {
  buffer: Buffer;
  byteLength: number;
  fileName: string;
  contentType: string; // always application/pdf for now
}

export interface InvoicePdfContext {
  invoice: Invoice;
  items: (InvoiceItem & { item?: Item })[];
  customer: Customer;
  related?: { salesOrder?: any; delivery?: any };
  mode?: 'enhanced' | 'simple';
}

export interface QuotationPdfContext {
  quotation: Quotation;
  items: (QuotationItem & { item?: Item })[];
  customer: Customer;
  mode?: 'enhanced' | 'simple';
}

// Currency formatting centralised
export function fmtCurrency(amount: number | string | null | undefined, currency = 'BHD') {
  const n = amount == null ? 0 : (typeof amount === 'string' ? parseFloat(amount) : amount);
  if (Number.isNaN(n)) return `${currency} 0.00`;
  return `${currency} ${n.toFixed(2)}`;
}

export function fmtDate(date: string | Date | null | undefined) {
  if (!date) return '';
  try { return new Date(date).toLocaleDateString('en-GB'); } catch { return ''; }
}

function baseDoc(): any { return new jsPDF(); }

// Convert number to words (simple, supports up to billions) for amount in words section
function numberToWords(num: number): string {
  if (!Number.isFinite(num)) return '';
  if (num === 0) return 'Zero';
  const belowTwenty = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function words(n: number): string {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10?'-'+belowTwenty[n%10]:'');
    if (n < 1000) return belowTwenty[Math.floor(n/100)] + ' Hundred' + (n%100? ' ' + words(n%100):'');
    if (n < 1_000_000) return words(Math.floor(n/1000)) + ' Thousand' + (n%1000? ' ' + words(n%1000):'');
    if (n < 1_000_000_000) return words(Math.floor(n/1_000_000)) + ' Million' + (n%1_000_000? ' ' + words(n%1_000_000):'');
    return words(Math.floor(n/1_000_000_000)) + ' Billion' + (n%1_000_000_000? ' ' + words(n%1_000_000_000):'');
  }
  return words(Math.floor(num));
}

function amountInWords(total: number, currency: string) {
  const integerPart = Math.floor(total);
  const fractional = Math.round((total - integerPart) * 100);
  const words = numberToWords(integerPart) || 'Zero';
  return `${currency} ${words} ${fractional > 0 ? fractional + '/100' : ''}`.trim();
}

// Enhanced invoice PDF - Tax Invoice format matching second image structure
export function buildEnhancedInvoicePdf(ctx: InvoicePdfContext): Buffer {
  const { invoice, items, customer } = ctx;
  const doc = baseDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Main header - dynamic between Proforma and Tax Invoice
  doc.setFontSize(16).setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  const isProforma = String((invoice as any).invoiceType || '').toLowerCase() === 'proforma';
  doc.text(isProforma ? 'PROFORMA INVOICE' : 'TAX INVOICE', pageWidth / 2, 20, { align: 'center' });
  
  // Top right corner - Invoice details
  const invoiceDetailsY = 30;
  doc.setFontSize(9).setFont('helvetica', 'normal');
  doc.text('Inv No :', pageWidth - 80, invoiceDetailsY);
  doc.text(`INV-${invoice.invoiceNumber}`, pageWidth - 50, invoiceDetailsY);
  doc.text('Date :', pageWidth - 80, invoiceDetailsY + 5);
  doc.text(fmtDate((invoice as any).invoiceDate || invoice.createdAt), pageWidth - 50, invoiceDetailsY + 5);

  // VAT Registration and company details (top left)
  doc.setFontSize(9).setFont('helvetica', 'bold');
  doc.text('VAT Reg No : 100004744700962', 20, invoiceDetailsY);
  doc.setFont('helvetica', 'normal');
  
  // Core invoice meta table (dynamic: SO, Delivery, Type, Status, Payment Terms, Due Date, Exchange Rate)
  const companyTableY = 45;
  const coreHead = [['Invoice Type','Status','Sales Order','Delivery','Payment Terms','Due Date','Currency','Exch Rate']];
  const coreBody = [[
    (invoice as any).invoiceType || 'Final',
    invoice.status || '',
    (invoice as any).salesOrderId ? String((invoice as any).salesOrderId).slice(0,8) : '',
    (invoice as any).deliveryId ? String((invoice as any).deliveryId).slice(0,8) : '',
    (invoice as any).paymentTerms || '',
    fmtDate((invoice as any).dueDate),
    (invoice as any).currency || 'BHD',
    (invoice as any).exchangeRate || '1.0000'
  ]];
  autoTable(doc, {
    startY: companyTableY,
    head: coreHead,
    body: coreBody,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [255,255,255], textColor: 0, fontStyle: 'bold' },
    margin: { left: 20, right: 20 },
    didParseCell: (data:any) => { if (data.section==='head') data.cell.styles.halign='center'; }
  });

  // Customer information section
  const afterCompanyTable = (doc as any).lastAutoTable?.finalY + 10 || companyTableY + 25;
  
  // Customer Name and Deliver To headers
  doc.setFontSize(9).setFont('helvetica', 'bold');
  doc.text('Customer Name :', 20, afterCompanyTable);
  doc.text('Deliver To :', pageWidth / 2 + 20, afterCompanyTable);
  
  // Customer details
  doc.setFont('helvetica', 'normal');
  const customerName = (customer as any).customerName || customer.name || 'Customer';
  doc.text(customerName.toUpperCase(), 20, afterCompanyTable + 8);
  
  // Customer address and details (left side)
  const custDetailsY = afterCompanyTable + 15;
  const custLines = [
    customer.address || 'EX KANDO POLYTHENE AND PROJECTS',
    customer.email || 'Building 574, Road 381 Manama Centre',
    customer.phone || 'Office Block 302, Manama,',
    customer.taxId ? `TRN :${customer.taxId}` : 'TRN :20000001520002'
  ];
  
  custLines.forEach((line, idx) => {
    doc.text(line, 20, custDetailsY + idx * 5);
  });

  // Deliver to address (right side)
  const deliverLines = [
    'EX KANDO POLYTHENE AND PROJECTS',
    'Building 574, Road 381 Manama Centre, Office Block 302',
    'Manama'
  ];
  
  deliverLines.forEach((line, idx) => {
    doc.text(line, pageWidth / 2 + 20, custDetailsY + idx * 5);
  });

  // Enhanced Items table with comprehensive tabular structure
  const tableStartY = custDetailsY + 35;
  const currency = (invoice as any).currency || 'BHD';
  
  const rows = items.map((it, i) => {
    const qty = Number(it.quantity) || 0;
    const rate = Number(it.unitPrice) || 0;
    const discountRate = Number(it.discountPercentage) || 0;
    const discountAmount = (rate * qty * discountRate) / 100;
    const netAmount = (rate * qty) - discountAmount;
    const vatRate = Number(it.taxRate) || 10; // Default 10% VAT
    const vatAmount = (netAmount * vatRate) / 100;
    const lineTotal = netAmount + vatAmount;
    
    // Enhanced description with item details
    let enhancedDesc = it.description || 'Item Description';
    if (it.supplierCode) enhancedDesc += `\nSupplier Code: ${it.supplierCode}`;
    if (it.barcode) enhancedDesc += `\nBarcode: ${it.barcode}`;
    if ((it as any).item?.category) enhancedDesc += `\nCategory: ${(it as any).item.category}`;
    
    return [
      (i + 1).toString(),
      enhancedDesc,
      `${qty} PCS`,
      `${currency} ${rate.toFixed(3)}`,
      discountRate > 0 ? `${discountRate.toFixed(1)}%` : '0%',
      `${currency} ${discountAmount.toFixed(2)}`,
      `${currency} ${netAmount.toFixed(2)}`,
      `${vatRate}%`,
      `${currency} ${vatAmount.toFixed(2)}`,
      `${currency} ${lineTotal.toFixed(2)}`
    ];
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [['Sl.', 'Description & Item Details', 'Qty', 'Unit Rate', 'Disc. %', 'Disc. Amt', 'Net Amount', 'VAT %', 'VAT Amt', 'Line Total']],
    body: rows,
    styles: { 
      fontSize: 7, 
      cellPadding: 2, 
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      valign: 'middle'
    },
    headStyles: { 
      fillColor: [255, 255, 255], // White background
      textColor: [0, 0, 0], // Black text
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 60, halign: 'left' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 18, halign: 'right' },
      6: { cellWidth: 20, halign: 'right' },
      7: { cellWidth: 12, halign: 'center' },
      8: { cellWidth: 18, halign: 'right' },
      9: { cellWidth: 20, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    margin: { left: 15, right: 15 }
  });

  const afterItemsTable = (doc as any).lastAutoTable?.finalY || tableStartY + 40;

  // Amount calculations (use stored values if present)
  const subtotal = Number((invoice as any).subtotal) || items.reduce((sum, it) => sum + ((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)), 0);
  const discountPerc = Number((invoice as any).discountPercentage) || 0;
  const discountAmount = Number((invoice as any).discountAmount) || (subtotal * discountPerc / 100);
  const taxRate = Number((invoice as any).taxRate) || 0;
  const taxAmount = Number((invoice as any).taxAmount) || ((subtotal - discountAmount) * taxRate / 100);
  const total = Number((invoice as any).totalAmount) || (subtotal - discountAmount + taxAmount);
  const paidAmount = Number((invoice as any).paidAmount) || 0;
  const outstandingAmount = Number((invoice as any).outstandingAmount) || (total - paidAmount);
  const subtotalBase = Number((invoice as any).subtotalBase) || 0;
  const discountAmountBase = Number((invoice as any).discountAmountBase) || 0;
  const taxAmountBase = Number((invoice as any).taxAmountBase) || 0;
  const totalAmountBase = Number((invoice as any).totalAmountBase) || 0;
  const baseCurrency = (invoice as any).baseCurrency || (invoice as any).currency || 'BHD';

  // Financial summary table (Invoice Currency)
  const finStartY = afterItemsTable + 5;
  autoTable(doc, {
    startY: finStartY,
    head: [[`${currency} Summary`, 'Amount']],
    body: [
      ['Subtotal', subtotal.toFixed(2)],
      ['Discount', discountAmount.toFixed(2)],
      ['Tax Rate', taxRate.toFixed(2) + '%'],
      ['Tax Amount', taxAmount.toFixed(2)],
      ['Total', total.toFixed(2)],
      ['Paid', paidAmount.toFixed(2)],
      ['Outstanding', outstandingAmount.toFixed(2)]
    ],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [220,220,220], textColor:0, fontStyle:'bold' },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign:'right' } },
    margin: { left: 20 }
  });

  // Base currency table if different
  if (baseCurrency && baseCurrency !== currency) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 3,
      head: [[`${baseCurrency} Base Summary`, 'Amount']],
      body: [
        ['Subtotal (Base)', subtotalBase.toFixed(2)],
        ['Discount (Base)', discountAmountBase.toFixed(2)],
        ['Tax (Base)', taxAmountBase.toFixed(2)],
        ['Total (Base)', totalAmountBase.toFixed(2)]
      ],
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [255,255,255], textColor:0, fontStyle:'bold' },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign:'right' } },
      margin: { left: 90 }
    });
  }

  const summaryY = (doc as any).lastAutoTable?.finalY + 8;

  // Summary box styling
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  
  // Summary labels and amounts
  const summaryItems = [
    ['Amount Chargeable (in words):', ''],
    [amountInWords(total, currency), ''],
    ['Subtotal:', subtotal.toFixed(2)],
    ['Discount:', discountAmount.toFixed(2)],
    ['Tax:', taxAmount.toFixed(2)],
    ['Total*:', total.toFixed(2)],
    ['Paid:', paidAmount.toFixed(2)],
    ['Outstanding:', outstandingAmount.toFixed(2)]
  ];

  let currentY = summaryY;
  summaryItems.forEach(([label, amount], idx) => {
    if (idx < 2) {
      // Amount in words section
      doc.setFont('helvetica', 'bold').setFontSize(8);
      doc.text(label, 20, currentY);
      if (amount) {
        doc.setFont('helvetica', 'normal');
        doc.text(amount, 20, currentY + 5);
      }
      currentY += (idx === 0) ? 5 : 10;
    } else {
      // Financial amounts
      doc.setFont('helvetica', 'normal').setFontSize(9);
      doc.text(label, pageWidth - 80, currentY);
      doc.setFont('helvetica', 'bold');
      doc.text(`${currency} ${amount}`, pageWidth - 25, currentY, { align: 'right' });
      if (label.includes('Total*')) {
        doc.line(pageWidth - 80, currentY + 1, pageWidth - 20, currentY + 1);
      }
      currentY += 6;
    }
  });

  // Notes, Internal Notes, Return Reason
  const notesY = currentY + 6;
  doc.setFont('helvetica','bold').setFontSize(8).text('Notes:', 20, notesY);
  doc.setFont('helvetica','normal');
  const notes = (invoice as any).notes || '---';
  const internalNotes = (invoice as any).internalNotes || '';
  const returnReason = (invoice as any).returnReason || '';
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
  doc.text(splitNotes, 20, notesY + 4);
  let afterNotesY = notesY + 4 + splitNotes.length * 4;
  if (internalNotes) {
    doc.setFont('helvetica','bold').text('Internal Notes:', 20, afterNotesY + 2);
    doc.setFont('helvetica','normal');
    const intLines = doc.splitTextToSize(internalNotes, pageWidth - 40);
    doc.text(intLines, 20, afterNotesY + 6);
    afterNotesY += 6 + intLines.length * 4;
  }
  if (returnReason) {
    doc.setFont('helvetica','bold').text('Return Reason:', 20, afterNotesY + 2);
    doc.setFont('helvetica','normal');
    const rrLines = doc.splitTextToSize(returnReason, pageWidth - 40);
    doc.text(rrLines, 20, afterNotesY + 6);
    afterNotesY += 6 + rrLines.length * 4;
  }

  const termsY = afterNotesY + 6;
  doc.setFont('helvetica', 'bold').setFontSize(8).text('Declaration:', 20, termsY);
  doc.setFont('helvetica', 'normal').text('We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.', 20, termsY + 4, { maxWidth: pageWidth - 40 });
  
  // Bottom section with company stamp and signature areas
  const bottomY = termsY + 18;
  doc.setFontSize(7).text('CK 6491-1, Reg.Address: Building 728, Road 2012, Town 2564, Country:Bahrain', 20, bottomY);
  // Document meta
  const metaLeftY = bottomY + 6;
  doc.setFont('helvetica','bold').setFontSize(7).text('Created:', 20, metaLeftY);
  doc.setFont('helvetica','normal').text(fmtDate((invoice as any).createdAt), 40, metaLeftY);
  doc.setFont('helvetica','bold').text('Updated:', 20, metaLeftY + 4);
  doc.setFont('helvetica','normal').text(fmtDate((invoice as any).updatedAt), 40, metaLeftY + 4);
  if ((invoice as any).paymentMethod) {
    doc.setFont('helvetica','bold').text('Payment Method:', 20, metaLeftY + 8);
    doc.setFont('helvetica','normal').text(String((invoice as any).paymentMethod), 50, metaLeftY + 8);
  }
  if ((invoice as any).paymentReference) {
    doc.setFont('helvetica','bold').text('Payment Ref:', 20, metaLeftY + 12);
    doc.setFont('helvetica','normal').text(String((invoice as any).paymentReference), 50, metaLeftY + 12);
  }
  if ((invoice as any).lastPaymentDate) {
    doc.setFont('helvetica','bold').text('Last Payment:', 20, metaLeftY + 16);
    doc.setFont('helvetica','normal').text(fmtDate((invoice as any).lastPaymentDate), 50, metaLeftY + 16);
  }
  
  // Signature area
  doc.setFont('helvetica','bold').text('for GOLDEN STYLE W.L.L', pageWidth - 80, bottomY + 8);
  doc.setFont('helvetica','normal').text('Authorised Signatory', pageWidth - 80, bottomY + 16);

  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(7).setTextColor(0);
  doc.text('Generated by GT ERP', 20, footerY);
  doc.text(new Date().toLocaleDateString(), pageWidth - 20, footerY, { align: 'right' });

  return Buffer.from(doc.output('arraybuffer'));
}

export function buildSimpleInvoicePdf(ctx: InvoicePdfContext): Buffer {
  const { invoice } = ctx;
  const doc = baseDoc();
  doc.setFontSize(16).setFont('helvetica','bold').text('INVOICE',20,20);
  doc.setFontSize(10).setFont('helvetica','normal').text(`Invoice #: ${invoice.invoiceNumber}`,20,30);
  return Buffer.from(doc.output('arraybuffer'));
}

export function generateInvoicePdf(ctx: InvoicePdfContext): PdfGenerateResult {
  const buffer = (ctx.mode === 'simple' ? buildSimpleInvoicePdf(ctx) : buildEnhancedInvoicePdf(ctx));
  return { buffer, byteLength: buffer.length, fileName: `invoice-${ctx.invoice.invoiceNumber}.pdf`, contentType: 'application/pdf' };
}

export function generateQuotationPdf(ctx: QuotationPdfContext): PdfGenerateResult {
  if (ctx.mode === 'simple') {
    const { quotation, items, customer } = ctx;
    const doc = baseDoc();
    doc.setFontSize(18).setFont('helvetica','bold').text('QUOTATION',20,20);
    doc.setFontSize(10).setFont('helvetica','normal');
    doc.text(`Quote #: ${(quotation as any).quotationNumber || quotation.quoteNumber}`,20,30);
    doc.text(`Date: ${fmtDate((quotation as any).quotationDate || (quotation as any).quoteDate || quotation.createdAt)}`,20,36);
    doc.setFont('helvetica','bold').text('Customer:',20,48);
    doc.setFont('helvetica','normal').text((customer as any).customerName || customer.name || '',20,54);
    const rows = items.map((it,i)=>[
      (i+1).toString(),
      it.description || '',
      it.quantity.toString(),
      fmtCurrency(it.unitPrice, (quotation as any).currency || 'BHD'),
      fmtCurrency(it.lineTotal, (quotation as any).currency || 'BHD')
    ]);
    autoTable(doc, { startY: 70, head: [['#','Description','Qty','Unit','Total']], body: rows, styles:{fontSize:8}, headStyles:{fillColor:[255,255,255], textColor:0}});
    const buffer = Buffer.from(doc.output('arraybuffer'));
    return { buffer, byteLength: buffer.length, fileName: `quotation-${(quotation as any).quotationNumber || quotation.quoteNumber}.pdf`, contentType: 'application/pdf' };
  }

  // Enhanced template replicating provided layout image
  const { quotation, items, customer } = ctx;
  const doc = baseDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(16).setFont('helvetica','bold').text('QUOTATION', pageWidth/2, 15, { align: 'center' });
  doc.setFontSize(8).setFont('helvetica','normal');

  // Meta table (Quotation No, Date, Customer Code, Sales Person, Payment Terms, Quote Validity / Lead Time placeholders)
  const customerCode = (customer as any).customerCode || (customer as any).code || '';
  const salesPerson = (quotation as any).salesPerson || (quotation as any).createdBy || '';
  const paymentTerms = (quotation as any).terms ? ((quotation as any).terms.split('\n')[0].slice(0,40)) : '30 Days';
  const leadTime = (quotation as any).leadTime || '10 days after receiving agreed LPO';
  const qDate = fmtDate((quotation as any).quoteDate || quotation.createdAt);
  const validUntil = fmtDate((quotation as any).validUntil);
  autoTable(doc, {
    startY: 22,
    head: [[ 'Quotation No', 'Quotation Date', 'Customer Code', 'Sales Person', 'Payment Terms', 'Lead Time / Validity' ]],
    body: [[
      (quotation as any).quotationNumber || quotation.quoteNumber,
      qDate,
      customerCode,
      String(salesPerson).slice(0,12),
      paymentTerms,
      validUntil || leadTime
    ]],
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [255,255,255], textColor:0, fontStyle:'bold' },
    margin: { left: 15, right: 15 }
  });

  const afterMeta = (doc as any).lastAutoTable.finalY + 3;
  // Customer Address & Contact table (two columns) – placeholders for contact person
  const addressLines = [
    (customer as any).customerName || customer.name || '',
    customer.address || '',
    customer.email || '',
    (customer as any).phone || customer.phone || ''
  ].filter(Boolean);
  const addressText = addressLines.length ? addressLines.join('\n') : 'N/A';
  const contactPerson = (quotation as any).contactPerson || (customer as any).contactPerson || '---';
  const contactLines = [ contactPerson, (customer as any).contactEmail || customer.email || '', (customer as any).contactPhone || customer.phone || '' ].filter(Boolean).join('\n');
  autoTable(doc, {
    startY: afterMeta,
    body: [
      [ { content: 'Customer Name & Address:\n' + addressText, styles: { halign:'left' } }, { content: 'Customer Contact Person:\n' + contactLines, styles:{ halign:'left'} } ]
    ],
    styles: { fontSize: 7, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: (pageWidth-30)/2 }, 1: { cellWidth: (pageWidth-30)/2 } },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  const afterAddress = (doc as any).lastAutoTable.finalY + 5;
  // Enhanced Items table with comprehensive columns for professional quotation
  const currency = (quotation as any).currency || 'BHD';
  const itemRows = items.map((it,i)=> {
    const qty = Number(it.quantity)||0;
    const unit = Number(it.unitPrice)||0;
    const discPerc = Number((quotation as any).discountPercentage)||0; // per-item discount not stored; using header discount
    const gross = qty*unit;
    const discAmt = gross * discPerc/100;
    const net = gross - discAmt;
    const vatPerc = Number((quotation as any).taxRate) || 0; // may not exist; fallback 0
    const vatAmt = net * vatPerc/100;
    const lineTotal = net + vatAmt;
    
    // Enhanced description with specifications
    let enhancedDesc = it.description || 'Product Description';
    if ((it as any).supplierCode) enhancedDesc += `\nCode: ${(it as any).supplierCode}`;
    if ((it as any).barcode) enhancedDesc += `\nBarcode: ${(it as any).barcode}`;
    if ((it as any).item?.category) enhancedDesc += `\nCategory: ${(it as any).item.category}`;
    if ((it as any).specifications) enhancedDesc += `\nSpecs: ${(it as any).specifications}`;
    
    return [
      (i+1).toString(),
      enhancedDesc,
      `${qty} PCS`,
      `${currency} ${unit.toFixed(3)}`,
      discPerc?`${discPerc.toFixed(1)}%`:'0%',
      `${currency} ${discAmt.toFixed(2)}`,
      `${currency} ${net.toFixed(2)}`,
      vatPerc?`${vatPerc.toFixed(1)}%`:'0%',
      `${currency} ${vatAmt.toFixed(2)}`,
      `${currency} ${lineTotal.toFixed(2)}`
    ];
  });
  
  autoTable(doc, {
    startY: afterAddress,
    head: [[ 'Sl.', 'Item Description & Specifications', 'Qty', 'Unit Rate', 'Disc.%', 'Disc. Amt', 'Net Total', 'VAT %', 'VAT Amt', 'Line Total' ]],
    body: itemRows,
    styles: { 
      fontSize: 7, 
      cellPadding: 2, 
      valign:'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: [255, 255, 255], // White background
      textColor: [0, 0, 0], // Black text
      fontStyle:'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 12, halign:'center' },
      1: { cellWidth: 55, halign: 'left' },
      2: { cellWidth: 15, halign:'center' },
      3: { cellWidth: 20, halign:'right' },
      4: { cellWidth: 15, halign:'center' },
      5: { cellWidth: 18, halign:'right' },
      6: { cellWidth: 20, halign:'right' },
      7: { cellWidth: 12, halign:'center' },
      8: { cellWidth: 18, halign:'right' },
      9: { cellWidth: 20, halign:'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    margin: { left: 15, right: 15 }
  });

  const afterItems = (doc as any).lastAutoTable.finalY + 4;
  // Summary tables (align right) – Total, Discount, Net, VAT, Grand Total
  const subtotal = Number((quotation as any).subtotal)|| itemRows.reduce((s,r)=> s + Number(r[7]),0);
  const discountAmount = Number((quotation as any).discountAmount)||0;
  const taxAmount = Number((quotation as any).taxAmount)||0;
  const totalAmount = Number((quotation as any).totalAmount)|| (subtotal - discountAmount + taxAmount);
  autoTable(doc, {
    startY: afterItems,
    theme: 'plain',
    body: [
      ['Total Amount', subtotal.toFixed(2)],
      ['Discount Amount', discountAmount.toFixed(2)],
      ['VAT Amount', taxAmount.toFixed(2)],
      ['Grand Total', totalAmount.toFixed(2)]
    ],
    styles: { fontSize:7, cellPadding:2 },
    columnStyles: { 0: { halign:'right', cellWidth: 40, fontStyle:'bold' }, 1: { halign:'right', cellWidth: 25, fontStyle:'bold' } },
    margin: { left: pageWidth - 15 - 65, right: 15 }
  });

  const afterSummary = (doc as any).lastAutoTable.finalY + 6;
  // Amount in words
  doc.setFont('helvetica','bold').setFontSize(7).text(`${currency} In Words:`, 15, afterSummary);
  doc.setFont('helvetica','normal');
  doc.text(amountInWords(totalAmount, currency) + ' ONLY', 15, afterSummary + 4);

  // Remarks / Notes box
  const remarks = (quotation as any).notes || (quotation as any).terms || '';
  const remarksLines = doc.splitTextToSize('Remarks:\n' + (remarks || '---'), pageWidth - 30);
  autoTable(doc, {
    startY: afterSummary + 8,
    body: [[ { content: remarksLines.join('\n'), styles: { fontSize:7, halign:'left' } }]],
    styles: { cellPadding: 3 },
    margin: { left: 15, right: 15 },
    theme: 'grid'
  });

  const afterRemarks = (doc as any).lastAutoTable.finalY + 6;
  // Terms line (validity) & signatures
  const validity = validUntil ? `This quote is valid until ${validUntil}` : 'This quote is valid for 15 days';
  doc.setFont('helvetica','normal').setFontSize(7).text(validity, 15, afterRemarks);
  const sigY = afterRemarks + 14;
  doc.setFont('helvetica','normal').text('_________________________', 15, sigY);
  doc.text('_________________________', pageWidth/2 + 20, sigY);
  doc.setFont('helvetica','bold').setFontSize(7).text('Authorized Signatory', 15, sigY + 5);
  doc.text('Customer Signature Date & Stamp', pageWidth/2 + 20, sigY + 5);

  const buffer = Buffer.from(doc.output('arraybuffer'));
  return { buffer, byteLength: buffer.length, fileName: `quotation-${(quotation as any).quotationNumber || quotation.quoteNumber}.pdf`, contentType: 'application/pdf' };
}

export type { InvoicePdfContext as InvoicePdfOptions, QuotationPdfContext as QuotationPdfOptions };
