import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface LabeledIconButtonProps extends ButtonProps {
  icon: LucideIcon;
  label: string;
}

export function LabeledIconButton({
  icon: Icon,
  label,
  ...props
}: LabeledIconButtonProps) {
  return (
    <Button {...props}>
      <Icon className="h-4 w-4 ml-2" />
      <span className="sr-only">{label}</span>
      {label}
    </Button>
  );
}
