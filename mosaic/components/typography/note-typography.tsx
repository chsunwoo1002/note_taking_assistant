export function NoteHeading1({ text }: { text: string }) {
  return <h1 className="text-2xl font-medium">{text}</h1>;
}

export function NoteHeading2({ text }: { text: string }) {
  return <h2 className="text-xl font-medium">{text}</h2>;
}

export function NoteHeading3({ text }: { text: string }) {
  return <h3 className="text-lg font-medium">{text}</h3>;
}

export function NoteHeading4({ text }: { text: string }) {
  return <h4 className="text-md font-medium">{text}</h4>;
}

export function NoteHeading5({ text }: { text: string }) {
  return <h5 className="text-sm font-medium">{text}</h5>;
}

export function NoteHeading6({ text }: { text: string }) {
  return <h6 className="text-xs font-medium">{text}</h6>;
}

export function NoteParagraph({ text }: { text: string }) {
  return <p className="text-base">{text}</p>;
}
