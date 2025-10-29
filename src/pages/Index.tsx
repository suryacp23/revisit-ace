import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { ProblemCard } from "@/components/ProblemCard";
import { StatsCard } from "@/components/StatsCard";
import { AddProblemDialog } from "@/components/AddProblemDialog";
import { toast } from "sonner";

interface Problem {
  _id: string;
  link: string;
  lastCompletedDate?: string;
  nextReviewDate?: string;
  successfullReview: number;
  createdAt: string;
}

const Index = () => {
  const [todayProblems, setTodayProblems] = useState<Problem[]>([]);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [reviewingProblemId, setReviewingProblemId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"today" | "all">("today");

  // Replace with your actual API endpoint
  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const [todayRes, allRes] = await Promise.all([
        fetch(`${API_BASE}/today-reviews`),
        fetch(`${API_BASE}/problem`),
      ]);
      
      const todayData = await todayRes.json();
      const allData = await allRes.json();
      
      setTodayProblems(todayData);
      setAllProblems(allData);
    } catch (error) {
      toast.error("Failed to fetch problems");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProblem = async (link: string) => {
    if (isAddingProblem) return;
    
    setIsAddingProblem(true);
    try {
      const res = await fetch(`${API_BASE}/problem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });
      
      if (res.ok) {
        toast.success("Problem added successfully!");
        fetchProblems();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add problem");
      console.error(error);
    } finally {
      setIsAddingProblem(false);
    }
  };

  const handleReviewProblem = async (id: string) => {
    if (reviewingProblemId) return;
    
    setReviewingProblemId(id);
    try {
      const res = await fetch(`${API_BASE}/review/${id}`, {
        method: "PUT",
      });
      
      if (res.ok) {
        toast.success("Problem reviewed! Keep up the great work 🎉");
        fetchProblems();
      }
    } catch (error) {
      toast.error("Failed to review problem");
      console.error(error);
    } finally {
      setReviewingProblemId(null);
    }
  };

  const displayProblems = activeView === "today" ? todayProblems : allProblems;
  const completedToday = allProblems.filter(
    (p) =>
      p.lastCompletedDate &&
      new Date(p.lastCompletedDate).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CodeRevise</h1>
                <p className="text-sm text-muted-foreground">Master problems through spaced repetition</p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-accent hover:opacity-90 shadow-elegant transition-all hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Problem
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <StatsCard
            title="Today's Reviews"
            value={todayProblems.length}
            icon={<Clock className="w-5 h-5" />}
            variant="primary"
          />
          <StatsCard
            title="Completed Today"
            value={completedToday}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="accent"
          />
          <StatsCard
            title="Total Problems"
            value={allProblems.length}
            icon={<BookOpen className="w-5 h-5" />}
            variant="secondary"
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6 animate-slide-up">
          <Button
            variant={activeView === "today" ? "default" : "outline"}
            onClick={() => setActiveView("today")}
            className={activeView === "today" ? "bg-gradient-primary" : ""}
          >
            Today's Reviews ({todayProblems.length})
          </Button>
          <Button
            variant={activeView === "all" ? "default" : "outline"}
            onClick={() => setActiveView("all")}
            className={activeView === "all" ? "bg-gradient-primary" : ""}
          >
            All Problems ({allProblems.length})
          </Button>
        </div>

        {/* Problems List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayProblems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {activeView === "today" ? "No reviews scheduled for today!" : "No problems yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeView === "today"
                ? "Great job staying on track! Check back tomorrow."
                : "Start building your practice library."}
            </p>
            {activeView === "all" && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-accent hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Problem
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-slide-up">
            {displayProblems.map((problem, idx) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                onReview={handleReviewProblem}
                isReviewing={reviewingProblemId === problem._id}
                style={{ animationDelay: `${idx * 50}ms` }}
              />
            ))}
          </div>
        )}
      </main>

      <AddProblemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddProblem}
        isLoading={isAddingProblem}
      />
    </div>
  );
};

export default Index;
