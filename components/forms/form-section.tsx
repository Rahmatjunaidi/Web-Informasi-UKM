import { GlassCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormSection({ children, className, description, title }: FormSectionProps) {
  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-white/[0.12] text-white glass-surface">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4 pt-5 sm:pt-6">{children}</CardContent>
    </GlassCard>
  );
}
