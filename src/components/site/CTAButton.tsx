import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const ctaVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-display font-medium tracking-tight transition-all duration-300 ease-[var(--ease-desk)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-circuit text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 hover:-translate-y-0.5",
        secondary:
          "border border-border bg-surface/60 text-foreground hover:border-circuit/60 hover:bg-surface-raised",
        ghost: "text-foreground/80 hover:text-circuit",
        outline:
          "border border-circuit/50 text-circuit hover:bg-circuit/10 hover:border-circuit",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm md:text-base",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type CTAButtonProps = VariantProps<typeof ctaVariants> & {
  to?: string;
  href?: string;
  event: string;
  eventProps?: Record<string, string | number | boolean>;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function CTAButton({
  to,
  href,
  event,
  eventProps,
  variant,
  size,
  className,
  children,
  type = "button",
  onClick,
}: CTAButtonProps) {
  const classes = cn(ctaVariants({ variant, size }), className);
  const handleClick = () => {
    trackEvent("cta_click", { cta: event, ...eventProps });
    onClick?.();
  };

  if (to) {
    return (
      <Link to={to} className={classes} onClick={handleClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={handleClick}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={handleClick}>
      {children}
    </button>
  );
}
