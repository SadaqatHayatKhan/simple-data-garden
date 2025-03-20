
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, checkSupabaseConnection } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import TaskList from "@/components/task/TaskList";
import { User } from "@/types";
import GlassCard from "@/components/ui-custom/GlassCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate("/login");
          return;
        }
        
        setUser(data.session.user as User);
        
        // Check Supabase connection
        const isConnected = await checkSupabaseConnection();
        setConnectionStatus(isConnected ? 'connected' : 'error');
        
        if (!isConnected) {
          toast.error("Could not connect to Supabase. Please check your configuration.");
        }
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
        setConnectionStatus('error');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // Set up real-time subscription
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/login");
        } else if (session && event === "SIGNED_IN") {
          setUser(session.user as User);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleRetryConnection = async () => {
    setConnectionStatus('checking');
    const isConnected = await checkSupabaseConnection();
    setConnectionStatus(isConnected ? 'connected' : 'error');
    
    if (isConnected) {
      toast.success("Successfully connected to Supabase!");
      // Refresh the page to reload all data
      window.location.reload();
    } else {
      toast.error("Still unable to connect to Supabase.");
    }
  };

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <div className="animate-pulse text-xl text-center">Loading...</div>
      </PageContainer>
    );
  }

  return (
    <>
      <Header user={user} />
      <PageContainer>
        <div className="space-y-8">
          <GlassCard className="animate-fade-in text-center p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-medium mb-2">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your tasks with a clean, minimal interface
            </p>
            
            {connectionStatus === 'error' && (
              <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-destructive">
                <p className="mb-2">Unable to connect to Supabase. Please check your configuration.</p>
                <p className="text-sm mb-4">Make sure you've linked your Supabase project correctly in Lovable.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryConnection}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </Button>
              </div>
            )}
          </GlassCard>
          
          {connectionStatus !== 'error' && <TaskList />}
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;
