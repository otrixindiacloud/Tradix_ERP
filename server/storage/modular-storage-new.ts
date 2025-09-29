import { IStorage } from './interfaces.js';
import { UserStorage } from './user-storage.js';
import { CustomerStorage } from './customer-storage.js';
import { SupplierStorage } from './supplier-storage.js';
import { ItemStorage } from './item-storage.js';
import { EnquiryStorage } from './enquiry-storage.js';
import { AuditStorage } from './audit-storage.js';
import { QuotationStorage } from './quotation-storage.js';

// Import the existing DatabaseStorage as a fallback for operations
// not yet modularized
import { DatabaseStorage } from "../storage.js";
import { BaseStorage } from './base.js';

// Comprehensive modular storage that delegates to specific modules
// where available and falls back to DatabaseStorage for operations
// not yet modularized
export class ModularStorage extends BaseStorage implements IStorage {
  private userStorage: UserStorage;
  private customerStorage: CustomerStorage;
  private supplierStorage: SupplierStorage;
  private itemStorage: ItemStorage;
  private enquiryStorage: EnquiryStorage;
  private auditStorage: AuditStorage;
  private quotationStorage: QuotationStorage;
  private fallbackStorage: DatabaseStorage;

  constructor() {
    super();
    this.userStorage = new UserStorage();
    this.customerStorage = new CustomerStorage();
    this.supplierStorage = new SupplierStorage();
    this.itemStorage = new ItemStorage();
    this.enquiryStorage = new EnquiryStorage();
    this.auditStorage = new AuditStorage();
    this.quotationStorage = new QuotationStorage();
    this.fallbackStorage = new DatabaseStorage();

    // Create proxy to forward any missing methods to fallbackStorage
    return new Proxy(this, {
      get(target: any, prop: string | symbol, receiver: any) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        if (prop in target.fallbackStorage) {
          const method = (target.fallbackStorage as any)[prop];
          if (typeof method === 'function') {
            return method.bind(target.fallbackStorage);
          }
          return method;
        }
        return undefined;
      }
    });
  }

  // User operations - delegate to UserStorage
  async getUser(id: string) {
    return this.userStorage.getUser(id);
  }

  async createUser(user: Parameters<UserStorage['createUser']>[0]) {
    return this.userStorage.createUser(user);
  }

  // Customer operations - delegate to CustomerStorage
  async getCustomers(limit?: number, offset?: number) {
    return this.customerStorage.getCustomers(limit, offset);
  }

  async getCustomer(id: string) {
    return this.customerStorage.getCustomer(id);
  }

  async createCustomer(customer: Parameters<CustomerStorage['createCustomer']>[0]) {
    return this.customerStorage.createCustomer(customer);
  }

  async updateCustomer(id: string, customer: Parameters<CustomerStorage['updateCustomer']>[1]) {
    return this.customerStorage.updateCustomer(id, customer);
  }

  // Supplier operations - delegate to SupplierStorage
  async getSuppliers() {
    return this.supplierStorage.getSuppliers();
  }

  async getSupplier(id: string) {
    return this.supplierStorage.getSupplier(id);
  }

  async createSupplier(supplier: Parameters<SupplierStorage['createSupplier']>[0]) {
    return this.supplierStorage.createSupplier(supplier);
  }

  // Item operations - delegate to ItemStorage
  async getItems() {
    return this.itemStorage.getItems();
  }

  async getItem(id: string) {
    return this.itemStorage.getItem(id);
  }

  async getItemByBarcode(barcode: string) {
    return this.itemStorage.getItemByBarcode(barcode);
  }

  async createItem(item: Parameters<ItemStorage['createItem']>[0]) {
    return this.itemStorage.createItem(item);
  }

  // Enquiry operations - delegate to EnquiryStorage
  async getEnquiries(limit?: number, offset?: number, filters?: Parameters<EnquiryStorage['getEnquiries']>[2]) {
    return this.enquiryStorage.getEnquiries(limit, offset, filters);
  }

  async getEnquiry(id: string) {
    return this.enquiryStorage.getEnquiry(id);
  }

  async createEnquiry(enquiry: Parameters<EnquiryStorage['createEnquiry']>[0]) {
    return this.enquiryStorage.createEnquiry(enquiry);
  }

  async updateEnquiry(id: string, enquiry: Parameters<EnquiryStorage['updateEnquiry']>[1]) {
    return this.enquiryStorage.updateEnquiry(id, enquiry);
  }

  async deleteEnquiry(id: string) {
    return this.enquiryStorage.deleteEnquiry(id);
  }

  async getEnquiryItems(enquiryId: string) {
    return this.enquiryStorage.getEnquiryItems(enquiryId);
  }

  async getEnquiryItem(id: string) {
    return this.enquiryStorage.getEnquiryItem(id);
  }

  async createEnquiryItem(enquiryItem: Parameters<EnquiryStorage['createEnquiryItem']>[0]) {
    return this.enquiryStorage.createEnquiryItem(enquiryItem);
  }

  async updateEnquiryItem(id: string, enquiryItem: Parameters<EnquiryStorage['updateEnquiryItem']>[1]) {
    return this.enquiryStorage.updateEnquiryItem(id, enquiryItem);
  }

  async deleteEnquiryItem(id: string) {
    return this.enquiryStorage.deleteEnquiryItem(id);
  }

  async bulkCreateEnquiryItems(enquiryItems: Parameters<EnquiryStorage['bulkCreateEnquiryItems']>[0]) {
    return this.enquiryStorage.bulkCreateEnquiryItems(enquiryItems);
  }

  // Quotation operations - delegate to QuotationStorage
  async getQuotations(limit?: number, offset?: number, filters?: Parameters<QuotationStorage['getQuotations']>[2]) {
    return this.quotationStorage.getQuotations(limit, offset, filters);
  }

  async getQuotation(id: string) {
    return this.quotationStorage.getQuotation(id);
  }

  async createQuotation(quotation: Parameters<QuotationStorage['createQuotation']>[0]) {
    return this.quotationStorage.createQuotation(quotation);
  }

  async updateQuotation(id: string, quotation: Parameters<QuotationStorage['updateQuotation']>[1]) {
    return this.quotationStorage.updateQuotation(id, quotation);
  }

  async deleteQuotation(id: string) {
    return this.quotationStorage.deleteQuotation(id);
  }

  async generateQuotationFromEnquiry(enquiryId: string, userId: string) {
    return this.quotationStorage.generateQuotationFromEnquiry(enquiryId, userId);
  }

  async createQuotationRevision(originalId: string, revisionData: any, userId: string) {
    return this.quotationStorage.createQuotationRevision(originalId, revisionData, userId);
  }

  async getQuotationRevisions(originalId: string) {
    return this.quotationStorage.getQuotationRevisions(originalId);
  }

  async getQuotationHistory(quotationId: string) {
    return this.quotationStorage.getQuotationHistory(quotationId);
  }

  async getQuotationItems(quotationId: string) {
    return this.quotationStorage.getQuotationItems(quotationId);
  }

  async createQuotationItem(item: Parameters<QuotationStorage['createQuotationItem']>[0]) {
    return this.quotationStorage.createQuotationItem(item);
  }

  async updateQuotationItem(id: string, item: Parameters<QuotationStorage['updateQuotationItem']>[1]) {
    return this.quotationStorage.updateQuotationItem(id, item);
  }

  async deleteQuotationItem(id: string) {
    return this.quotationStorage.deleteQuotationItem(id);
  }

  async getQuotationApprovals(quotationId: string) {
    return this.quotationStorage.getQuotationApprovals(quotationId);
  }

  async createQuotationApproval(approval: Parameters<QuotationStorage['createQuotationApproval']>[0]) {
    return this.quotationStorage.createQuotationApproval(approval);
  }

  // Audit operations - delegate to AuditStorage  
  async logAuditEvent(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    oldData?: any,
    newData?: any
  ) {
    return this.auditStorage.logAuditEvent(entityType, entityId, action, userId, oldData, newData);
  }
}
