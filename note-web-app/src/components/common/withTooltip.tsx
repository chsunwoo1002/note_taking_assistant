import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WithTooltipProps {
  tooltipContent: React.ReactNode;
}

const withTooltip = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithTooltip: React.FC<P & WithTooltipProps> = ({
    tooltipContent,
    ...props
  }) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <WrappedComponent {...(props as P)} />
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    );
  };

  return ComponentWithTooltip;
};

export default withTooltip;
