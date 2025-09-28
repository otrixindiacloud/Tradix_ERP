import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  HelpCircle, 
  FileText, 
  Upload, 
  ShoppingCart, 
  Receipt, 
  Truck, 
  Package, 
  Building2, 
  Warehouse, 
  TruckIcon, 
  Boxes, 
  DollarSign, 
  Bot, 
  BarChart, 
  FileDown, 
  RefreshCw,
  Activity
} from "lucide-react";
import { 
  FaHome, 
  FaQuestionCircle, 
  FaFileInvoice, 
  FaUpload, 
  FaShoppingCart, 
  FaReceipt, 
  FaTruck, 
  FaBox, 
  FaBuilding, 
  FaWarehouse, 
  FaBoxes, 
  FaDollarSign, 
  FaRobot, 
  FaChartBar, 
  FaDownload, 
  FaSync, 
  FaChartLine,
  FaCog,
  FaUsers,
  FaBell,
  FaHistory,
  FaFileExport,
  FaCogs,
  FaUserCog,
  FaDatabase,
  FaClipboardList,
  FaTruckLoading,
  FaBoxOpen,
  FaMoneyBillWave,
  FaBrain,
  FaTasks,
  FaFileAlt,
  FaShoppingBag,
  FaFileInvoiceDollar,
  FaTruckMoving,
  FaBoxes as FaBoxesAlt,
  FaWarehouse as FaWarehouseAlt,
  FaDollarSign as FaDollarSignAlt,
  FaRobot as FaRobotAlt,
  FaChartBar as FaChartBarAlt,
  FaDownload as FaDownloadAlt,
  FaSync as FaSyncAlt,
  FaChartLine as FaActivityAlt,
  FaSignOutAlt
} from "react-icons/fa";

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <aside 
      id="sidebar" 
      className="w-64 bg-white/95 backdrop-blur-sm shadow-lg border-r border-gray-200 fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 -translate-x-full flex flex-col"
    >
      <nav className="p-6 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
        {/* Dashboard */}
        <Link href="/">
          <a
            className={cn(
              "sidebar-item",
              isActive("/") 
                ? "sidebar-item-active" 
                : "text-gray-700"
            )}
            data-testid="link-dashboard"
          >
            <FaHome className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Dashboard</span>
          </a>
        </Link>
        
        {/* Sales Management Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Sales Management
          </h3>
          <div className="space-y-1">
            <Link href="/customer-management">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/customer-management")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-customers"
              >
                <FaUsers className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Customers</span>
              </a>
            </Link>
            <Link href="/enquiries">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/enquiries")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-enquiry"
              >
                <FaQuestionCircle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Enquiry</span>
              </a>
            </Link>
            <Link href="/quotations">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/quotations")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-quotation"
              >
                <FaFileInvoice className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Quotation</span>
              </a>
            </Link>
            <Link href="/customer-po-upload">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/customer-po-upload")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-customer-po-upload"
              >
                <FaUpload className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Customer PO Upload</span>
              </a>
            </Link>
            <Link href="/sales-orders">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/sales-orders")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-sales-order"
              >
                <FaShoppingCart className="h-5 w-5 text-green-600" />
                <span className="font-medium">Sales Order</span>
              </a>
            </Link>
            <Link href="/delivery-note">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/delivery-note")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-delivery-note"
              >
                <FaTruckMoving className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Delivery Note</span>
              </a>
            </Link>
            <Link href="/invoicing">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/invoicing")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-invoice"
              >
                <FaReceipt className="h-5 w-5 text-green-600" />
                <span className="font-medium">Invoicing</span>
              </a>
            </Link>
            {/* <Link href="/standalone-invoice">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/standalone-invoice")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-standalone-invoice"
              >
                <FaFileInvoice className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Standalone Invoice</span>
              </a>
            </Link> */}
          </div>
        </div>

        {/* Purchase Management Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Purchase Management
          </h3>
          <div className="space-y-1">
            {/* Suppliers */}
            <Link href="/suppliers">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/suppliers")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-suppliers"
              >
                <FaBuilding className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Suppliers</span>
              </a>
            </Link>
            {/* Requisitions */}
            <Link href="/requisitions">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/requisitions")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-requisitions"
              >
                <FaClipboardList className="h-5 w-5 text-blue-700" />
                <span className="font-medium">Requisitions</span>
              </a>
            </Link>
            {/* Supplier Quotes */}
            <Link href="/supplier-quotes">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/supplier-quotes")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-supplier-quotes"
              >
                <FaFileExport className="h-5 w-5 text-amber-700" />
                <span className="font-medium">Supplier Quotes</span>
              </a>
            </Link>
            {/* Supplier LPO */}
            <Link href="/supplier-lpo">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/supplier-lpo")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-supplier-lpo"
              >
                <FaTruck className="h-5 w-5 text-indigo-500" />
                <span className="font-medium">Supplier LPO</span>
              </a>
            </Link>
            {/* Shipment Tracking */}
            <Link href="/shipment-tracking">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/shipment-tracking")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-shipment-tracking"
              >
                <FaTruckLoading className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Shipment Tracking</span>
              </a>
            </Link>
            {/* Goods Receipts (GRN) */}
            <Link href="/goods-receipt">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/goods-receipt")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-goods-receipt"
              >
                <FaBoxOpen className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Goods Receipts (GRN)</span>
              </a>
            </Link>
            {/* Purchase Invoices */}
            <Link href="/purchase-invoices">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/purchase-invoices")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-purchase-invoices"
              >
                <FaFileInvoiceDollar className="h-5 w-5 text-green-700" />
                <span className="font-medium">Purchase Invoices</span>
              </a>
            </Link>
          </div>
        </div>

        {/* Inventory Management Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Inventory Management
          </h3>
          <div className="space-y-1">
            <Link href="/inventory">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/inventory")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-inventory"
              >
                <FaWarehouse className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Inventory Items</span>
              </a>
            </Link>
            <Link href="/delivery">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/delivery")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-delivery-&-picking"
              >
                <FaTruckLoading className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Delivery & Picking</span>
              </a>
            </Link>
            {/* <Link href="/delivery-management">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/delivery-management")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-delivery-management"
              >
                <FaTruckMoving className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Delivery Management</span>
              </a>
            </Link> */}
            <Link href="/inventory-management">
              <a 
                className={cn(
                  "sidebar-item",
                  isActive("/inventory-management")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-inventory-management"
              >
                <FaBoxes className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Inventory Management</span>
              </a>
            </Link>
            {/* New Inventory Management Navigation */}
            {/* <Link href="/items">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/items")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-items"
              >
                <FaBox className="h-5 w-5 text-blue-700" />
                <span className="font-medium">Items</span>
              </a>
            </Link> */}
            <Link href="/material-requests">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/material-requests")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-material-requests"
              >
                <FaClipboardList className="h-5 w-5 text-amber-700" />
                <span className="font-medium">Material Requests</span>
              </a>
            </Link>
            <Link href="/receipts">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/receipts")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-receipts"
              >
                <FaReceipt className="h-5 w-5 text-green-700" />
                <span className="font-medium">Inventory Receipts</span>
              </a>
            </Link>
            <Link href="/stock-issues">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/stock-issues")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-stock-issues"
              >
                <FaBoxOpen className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Stock Issues</span>
              </a>
            </Link>
            <Link href="/receipt-returns">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/receipt-returns")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-receipt-returns"
              >
                <FaMoneyBillWave className="h-5 w-5 text-red-600" />
                <span className="font-medium">Returns Receipt </span>
              </a>
            </Link>
            <Link href="/stock-transfer">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/stock-transfer")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-stock-transfer"
              >
                <FaTruck className="h-5 w-5 text-indigo-500" />
                <span className="font-medium">Transfer Stocks</span>
              </a>
            </Link>
            <Link href="/physical-stock">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/physical-stock")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-physical-stock"
              >
                <FaBoxesAlt className="h-5 w-5 text-purple-700" />
                <span className="font-medium">Physical Stock</span>
              </a>
            </Link>
          </div>
        </div>

        {/* Administration Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Administration
          </h3>
          <div className="space-y-1">
            <Link href="/pricing">
              <a 
                className={cn(
                  "sidebar-item",
                  isActive("/pricing")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-pricing-costing"
              >
                <FaDollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium">Pricing & Costing</span>
              </a>
            </Link>
            <Link href="/ai-demo">
              <a 
                className={cn(
                  "sidebar-item",
                  isActive("/ai-demo")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-ai-demo"
                onClick={() => console.log('Sidebar AI Assistant button clicked!')}
              >
                <FaBrain className="h-5 w-5 text-purple-600" />
                <span className="font-medium">AI Assistant</span>
                <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">NEW</Badge>
              </a>
            </Link>
            <Link href="/recent-activities">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/recent-activities")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-recent-activities"
              >
                <FaActivityAlt className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Recent Activities</span>
              </a>
            </Link>
            <Link href="/analytics">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/analytics")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-analytics"
              >
                <FaChartBar className="h-5 w-5 text-indigo-600" />
                <span className="font-medium">Analytics</span>
              </a>
            </Link>
            <Link href="/export-data">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/export-data")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-export-data"
              >
                <FaDownload className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Export Data</span>
              </a>
            </Link>
            <Link href="/tally-integration">
              <a
                className={cn(
                  "sidebar-item",
                  isActive("/tally-integration")
                    ? "sidebar-item-active"
                    : "text-gray-700"
                )}
                data-testid="link-tally-integration"
              >
                <FaSync className="h-5 w-5 text-green-600" />
                <span className="font-medium">Tally Integration</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>
      {/* User / Logout Section */}
      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        {user && (
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="truncate">
              <div className="font-medium text-gray-800 truncate" title={user.username}>{user.username}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide">{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-200"
          data-testid="button-logout"
        >
          <FaSignOutAlt className="h-4 w-4 text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
