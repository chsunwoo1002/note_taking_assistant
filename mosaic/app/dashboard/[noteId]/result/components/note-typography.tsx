import React from "react";

const headingStyles = {
  heading1: "text-2xl",
  heading2: "text-xl",
  heading3: "text-lg",
  heading4: "text-md",
  heading5: "text-sm",
  heading6: "text-xs",
  paragraph: "text-base",
} as const;

export type NoteTypographyType = keyof typeof headingStyles;

interface NoteTypographyProps {
  type: NoteTypographyType;
  text: string;
}

export function NoteTypography({ type, text }: NoteTypographyProps) {
  // Dynamically determine the HTML tag based on the 'type' prop
  // For headings, extract the number from the type (e.g., 'heading1' -> 'h1')
  // The 'as keyof JSX.IntrinsicElements' cast ensures type safety for JSX elements
  const Tag =
    type === "paragraph"
      ? "p"
      : (`h${type.slice(-1)}` as keyof JSX.IntrinsicElements);

  const className = `${headingStyles[type]} ${type !== "paragraph" ? "font-medium" : ""}`;

  // Use React.createElement to dynamically create the appropriate HTML element
  // Pass the className as a prop and the text as the child content
  return React.createElement(Tag, { className }, text);
}
