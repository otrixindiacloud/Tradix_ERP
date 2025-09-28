import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 p-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-8 w-8 rounded-full" />
        </div>
        <LoadingSkeleton className="h-8 w-24" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-3 w-full" />
          <LoadingSkeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}
