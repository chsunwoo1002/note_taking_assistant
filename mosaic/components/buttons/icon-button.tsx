"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import withTooltip from "@/components/hoc/withTooltip";

interface IconButtonProps extends Omit<ButtonProps, "children" | "size"> {
  icon: React.ReactNode;
  ariaLabel: string;
}

function BaseIconButton({ icon: Icon, ariaLabel, ...props }: IconButtonProps) {
  return (
    <Button {...props} aria-label={ariaLabel} size="icon">
      {Icon}
    </Button>
  );
}

export const IconButton = withTooltip(BaseIconButton);
