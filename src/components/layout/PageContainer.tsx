
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  fullWidth = false,
}) => {
  // Add animation class to the body when the component mounts
  useEffect(() => {
    const body = document.querySelector("body");
    body?.classList.add("animate-fade-in");
    
    return () => {
      body?.classList.remove("animate-fade-in");
    };
  }, []);

  return (
    <main
      className={cn(
        "min-h-screen pt-24 pb-16 px-4 sm:px-6 animate-fade-in",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto h-full",
          fullWidth ? "w-full" : "max-w-7xl"
        )}
      >
        {children}
      </div>
    </main>
  );
};

export default PageContainer;
