
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, checkSupabaseConnection } from "@/lib/supabase";
import { toast } from "sonner";
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui-custom/GlassCard";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [connectionTested, setConnectionTested] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setIsConfigured(isConnected);
        setConnectionTested(true);
        
        // Check for user session
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setIsConfigured(false);
        setConnectionTested(true);
      }
    };
    
    testConnection();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectionTested) {
      toast.error("Still checking Supabase connection. Please wait.");
      return;
    }
    
    if (!isConfigured) {
      toast.error("Supabase is not properly configured");
      return;
    }
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Logging in user with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // If we get an invalid login credentials error, try to provide better guidance
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. If you just signed up, make sure you're using the same credentials.");
        } else {
          toast.error(error.message || "Failed to sign in");
        }
        throw error;
      }
      
      console.log("Login successful:", data);
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset instructions");
    }
  };

  return (
    <>
      <Header user={user} />
      <PageContainer className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <GlassCard className="animate-scale-in" variant="elevated">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-medium">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your account to continue
              </p>
            </div>
            
            {!isConfigured && connectionTested && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Supabase not configured</AlertTitle>
                <AlertDescription>
                  Please link your Supabase project in Lovable settings to enable authentication.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              
              <AnimatedButton 
                className="w-full mt-6" 
                type="submit"
                loading={loading}
                disabled={!connectionTested || !isConfigured}
              >
                Sign In
              </AnimatedButton>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </GlassCard>
        </div>
      </PageContainer>
    </>
  );
};

export default Login;
