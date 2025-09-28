#!/usr/bin/env node
// Seed minimal data for PDF testing (customer, quotation, invoice + items)
import fetch from 'node-fetch';

const BASE = process.env.BASE_URL || 'http://localhost:5000/api';

async function safeFetch(url, options={}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${options.method||'GET'} ${url} -> ${res.status}`);
  return res.json();
}

async function run() {
  console.log('Seeding PDF test data...');

  // 1. Customer (reuse if exists by name)
  let customers = [];
  try { customers = await safeFetch(`${BASE}/customers`); } catch {}
  let customer = customers.find(c => c.name === 'PDF Test Customer');
  if (!customer) {
    customer = await safeFetch(`${BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'PDF Test Customer',
        email: 'pdf-test@example.com',
        phone: '+000000000',
        customerType: 'Corporate',
        classification: 'Standard'
      })
    });
    console.log('Created customer:', customer.id);
  } else {
    console.log('Reusing existing test customer:', customer.id);
  }

  // 2. Quotation (simple)
  let quotations = [];
  try { quotations = await safeFetch(`${BASE}/quotations`); } catch {}
  let quotation = quotations.find(q => q.customerId === customer.id);
  if (!quotation) {
    quotation = await safeFetch(`${BASE}/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: customer.id,
        quoteNumber: 'QT-PDF-' + Date.now(),
        status: 'Draft',
        currency: 'USD',
        totalAmount: 150,
        subtotal: 150,
        taxAmount: 0,
        discountAmount: 0
      })
    });
    console.log('Created quotation:', quotation.id);
  } else {
    console.log('Reusing quotation:', quotation.id);
  }

  // Add a quotation item if none
  const qItems = await safeFetch(`${BASE}/quotation-items?quotationId=${quotation.id}`).catch(()=>[]);
  if (!qItems.length) {
    const newItem = await safeFetch(`${BASE}/quotation-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quotationId: quotation.id,
        description: 'Sample Quoted Item',
        quantity: 3,
        unitPrice: 50,
        lineTotal: 150
      })
    });
    console.log('Added quotation item:', newItem.id);
  }

  // 3. Invoice (simple direct create)
  let invoices = [];
  try { invoices = await safeFetch(`${BASE}/invoices`); } catch {}
  let invoice = invoices.find(inv => inv.customerId === customer.id);
  if (!invoice) {
    invoice = await safeFetch(`${BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: customer.id,
        invoiceNumber: 'INV-PDF-' + Date.now(),
        currency: 'USD',
        subtotal: 150,
        taxAmount: 0,
        totalAmount: 150,
        status: 'Draft'
      })
    });
    console.log('Created invoice:', invoice.id);
  } else {
    console.log('Reusing invoice:', invoice.id);
  }

  const invItems = await safeFetch(`${BASE}/invoices/${invoice.id}/items`).catch(()=>[]);
  if (!invItems.length) {
    const item = await safeFetch(`${BASE}/invoice-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId: invoice.id,
        description: 'Sample Invoiced Item',
        quantity: 3,
        unitPrice: 50,
        totalPrice: 150
      })
    });
    console.log('Added invoice item:', item.id);
  }

  console.log('\nSeed summary:');
  console.log(' Customer:', customer.id);
  console.log(' Quotation:', quotation.id);
  console.log(' Invoice:', invoice.id);
  console.log('\nYou can now test:');
  console.log(`  GET ${BASE}/quotations/${quotation.id}/pdf`);
  console.log(`  GET ${BASE}/invoices/${invoice.id}/pdf`);
}

run().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
