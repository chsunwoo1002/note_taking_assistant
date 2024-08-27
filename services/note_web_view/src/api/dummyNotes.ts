import { Note } from "@/app/dashboard/page";

const notes = [
  {
    id: 1,
    title: "Note 1",
    content: "This is note 1",
  },
  {
    id: 2,
    title: "Note 2",
    content: "This is note 2",
  },
  {
    id: 3,
    title: "Note 3",
    content: "This is note 3",
  },
  {
    id: 4,
    title: "Note 4",
    content: "This is note 4",
  },
  {
    id: 5,
    title: "Note 5",
    content: "This is note 5",
  },
  {
    id: 6,
    title: "Note 6",
    content: "This is note 6",
  },
];

export const getNotes = async (): Promise<any> => {
  const notes = await fetch("http://localhost:8080/note/info/all");

  const data = await notes.json();
  console.log(data.data);
  return data.data;
};

export const getNoteWithId = async (id: string): Promise<any> => {
  const noteResult = await fetch(`http://localhost:8080/note/result/${id}`);

  const data = await noteResult.json();
  console.log(data.data);
  return data.data.sort((a: any, b: any) => a.order_index - b.order_index);
};
