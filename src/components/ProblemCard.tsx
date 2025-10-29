import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, Calendar, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProblemCardProps {
  problem: {
    _id: string;
    link: string;
    lastCompletedDate?: string;
    nextReviewDate?: string;
    successfullReview: number;
    createdAt: string;
  };
  onReview: (id: string) => void;
  isReviewing?: boolean;
  style?: React.CSSProperties;
}

export const ProblemCard = ({ problem, onReview, isReviewing, style }: ProblemCardProps) => {
  const getDaysUntilReview = () => {
    if (!problem.nextReviewDate) return null;
    const days = Math.ceil(
      (new Date(problem.nextReviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const daysUntilReview = getDaysUntilReview();
  const isOverdue = daysUntilReview !== null && daysUntilReview < 0;
  const isDueToday = daysUntilReview === 0;

  return (
    <Card
      className="p-6 hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in group"
      style={style}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors truncate flex items-center gap-2 group/link"
            >
              <span className="truncate">{problem.link}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>{problem.successfullReview} successful reviews</span>
            </div>

            {problem.nextReviewDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span
                  className={
                    isOverdue
                      ? "text-destructive font-medium"
                      : isDueToday
                      ? "text-accent font-medium"
                      : ""
                  }
                >
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysUntilReview!)} days`
                    : isDueToday
                    ? "Due today"
                    : `Review in ${daysUntilReview} days`}
                </span>
              </div>
            )}

            {problem.lastCompletedDate && (
              <div className="text-muted-foreground">
                Last reviewed {formatDistanceToNow(new Date(problem.lastCompletedDate), { addSuffix: true })}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={() => onReview(problem._id)}
          className="bg-gradient-primary hover:opacity-90 shadow-elegant transition-all hover:shadow-lg flex-shrink-0"
          disabled={isReviewing}
        >
          {isReviewing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Reviewing...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark Reviewed
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
