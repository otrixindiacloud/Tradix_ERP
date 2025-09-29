import { ReactNode } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import AIAssistant from "@/components/ai-assistant/ai-assistant";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pl-0 pr-4 sm:pr-6 pt-4 sm:pt-6 pb-4 sm:pb-6 overflow-auto scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
