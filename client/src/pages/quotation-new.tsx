import { useLocation } from "wouter";
import QuotationForm from "@/components/forms/quotation-form";

export default function QuotationNewPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Quotation</h1>
        <p className="text-gray-600">Generate a new quotation with automated pricing</p>
      </div>
      
      <QuotationForm 
        onSuccess={(quotation) => {
          navigate(`/quotations/${quotation.id}`);
        }}
        onCancel={() => {
          navigate(`/quotations`);
        }}
      />
    </div>
  );
}