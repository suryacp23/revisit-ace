import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant?: "primary" | "accent" | "secondary";
}

export const StatsCard = ({ title, value, icon, variant = "primary" }: StatsCardProps) => {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    accent: "bg-gradient-accent",
    secondary: "bg-muted",
  };

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-card transition-all duration-300 animate-scale-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${gradientClasses[variant]} flex items-center justify-center text-white shadow-elegant`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
