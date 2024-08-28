import { env } from "@/lib/env.config";

export const getNotes = async (): Promise<any> => {
  const notes = await fetch(`${env.NOTE_CREATION_SERVER_URL}/note/list/all`);

  const data = await notes.json();
  console.log(data.data);
  return data.data;
};

export const getNoteWithId = async (id: string): Promise<any> => {
  const noteResult = await fetch(
    `${env.NOTE_CREATION_SERVER_URL}/note/result/${id}`
  );

  const data = await noteResult.json();
  console.log(data.data);
  return data.data.sort((a: any, b: any) => a.order_index - b.order_index);
};
