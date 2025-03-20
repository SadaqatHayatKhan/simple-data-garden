
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AnimatedButton from "../ui-custom/AnimatedButton";

const Header = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <header className="w-full py-4 px-6 border-b border-border bg-background/70 backdrop-blur-lg fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight transition-opacity hover:opacity-80"
        >
          Minimal Tasks
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <AnimatedButton 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
              >
                Sign Out
              </AnimatedButton>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <AnimatedButton 
                size="sm" 
                asChild
              >
                <Link to="/register">
                  Sign Up
                </Link>
              </AnimatedButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
