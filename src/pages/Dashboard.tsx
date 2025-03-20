
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import TaskList from "@/components/task/TaskList";
import { User } from "@/types";
import GlassCard from "@/components/ui-custom/GlassCard";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
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
          </GlassCard>
          
          <TaskList />
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;
