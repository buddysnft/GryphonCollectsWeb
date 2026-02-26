interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "danger" | "default";
  size?: "sm" | "md";
}

export default function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const variants = {
    primary: "bg-primary-light text-primary",
    success: "bg-success/20 text-success",
    danger: "bg-danger/20 text-danger",
    default: "bg-surface-hover text-text-secondary",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
