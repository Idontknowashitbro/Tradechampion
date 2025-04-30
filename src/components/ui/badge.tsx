import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ 
  className = "", 
  variant = "default",
  ...props 
}: BadgeProps) {
  const variantClasses = {
    default: "bg-forex-primary text-white border-transparent",
    secondary: "bg-forex-card text-white border-transparent",
    destructive: "bg-red-500/20 text-red-500 border-transparent",
    outline: "bg-transparent border-forex-border/30 text-white"
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`} 
      {...props} 
    />
  )
}

export const badgeVariants = (props: { variant?: BadgeProps['variant'] }) => {
  return "";
};
