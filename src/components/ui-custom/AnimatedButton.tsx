
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  loading?: boolean;
}

const AnimatedButton = ({
  children,
  className,
  loading = false,
  ...props
}: AnimatedButtonProps) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
        loading && "pointer-events-none",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading</span>
        </span>
      ) : (
        <span className="flex items-center justify-center">{children}</span>
      )}
    </Button>
  );
};

export default AnimatedButton;
