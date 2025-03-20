
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import GlassCard from "@/components/ui-custom/GlassCard";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Header user={null} />
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-24">
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Minimal Task Manager
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                Beautifully simple task management
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-xl mx-auto">
                A clean, intuitive task management app inspired by minimalist design principles.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <AnimatedButton size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </AnimatedButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <GlassCard className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-medium">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Create Tasks</h3>
              <p className="text-muted-foreground">
                Quickly add new tasks with titles and optional detailed descriptions.
              </p>
            </GlassCard>

            <GlassCard className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-medium">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Mark tasks as complete and easily view your accomplishments.
              </p>
            </GlassCard>

            <GlassCard className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-medium">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Stay Organized</h3>
              <p className="text-muted-foreground">
                Edit, update, and delete tasks as your priorities change.
              </p>
            </GlassCard>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default Index;
