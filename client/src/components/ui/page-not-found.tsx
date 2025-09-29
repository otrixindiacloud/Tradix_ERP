import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";

interface PageNotFoundProps {
  /** Custom icon to display */
  icon?: ReactNode;
  /** Main title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom action buttons */
  actions?: ReactNode;
  /** Show default navigation buttons */
  showDefaultActions?: boolean;
  /** Back button URL */
  backUrl?: string;
  /** Back button text */
  backText?: string;
  /** Custom CSS classes */
  className?: string;
}

export default function PageNotFound({
  icon,
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  actions,
  showDefaultActions = true,
  backUrl,
  backText = "Go Back",
  className = ""
}: PageNotFoundProps) {
  const [, setLocation] = useLocation();

  const handleGoBack = () => {
    if (backUrl) {
      setLocation(backUrl);
    } else {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4 ${className}`}>
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {icon || <AlertCircle className="h-16 w-16 text-orange-500" />}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            {actions}
            
            {showDefaultActions && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backText}
                </Button>
                
                <Button 
                  onClick={handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
                
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}