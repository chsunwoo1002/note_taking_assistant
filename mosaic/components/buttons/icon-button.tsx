"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import withTooltip from "@/components/hoc/withTooltip";

interface IconButtonProps extends Omit<ButtonProps, "children" | "size"> {
  icon: LucideIcon;
  ariaLabel: string;
}

function BaseIconButton({ icon: Icon, ariaLabel, ...props }: IconButtonProps) {
  return (
    <Button {...props} aria-label={ariaLabel} size="icon">
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export const IconButton = withTooltip(BaseIconButton);
