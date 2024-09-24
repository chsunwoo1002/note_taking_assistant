"use server";

import { getNote, getNoteContents, getNoteResult } from "@/utils/supabase/note";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORGANIZATION!,
});

export const createNoteResult = async (noteId: string) => {
  const [noteContents, note] = await Promise.all([
    getNoteContents(noteId),
    getNote(noteId),
  ]);

  if (noteContents.error || note.error || !note.data || !noteContents.data) {
    return { error: noteContents.error || note.error };
  }

  const generatedNoteResult = await generateNoteResult(
    note.data.title,
    note.data.instruction,
    noteContents.data
      .map((content) => content.content)
      .filter((content) => content !== null)
  );

  if (generatedNoteResult.error) {
    return { error: generatedNoteResult.error };
  }

  return { data: generatedNoteResult.data };
};

export const generateNoteResult = async (
  title: string,
  instruction: string | null,
  contents: string[]
) => {
  const generatedNoteSchema = z.object({
    contents: z.array(
      z.object({
        type: z.enum([
          "heading1",
          "heading2",
          "heading3",
          "heading4",
          "paragraph",
        ]),
        content: z.string(),
      })
    ),
  });
  const prompt = `
        Title: ${title}
    
        Content:
        ${contents.map((content, idx) => `${idx + 1}. ${content}`).join("\n\n")}
    
        User Instruction: ${instruction || "No instruction"}
    
        Based on the above title and content, please create a well-structured document. The document should:
        1. Start with an introduction that explains the main topic.
        2. Organize the content into logical sections with appropriate headings.
          a. Maximum depth of section is 5
          b. Divde the section based on context
          c. the maximum size of words for each section is 200 words
        3. Include a brief conclusion or summary at the end.
        4. Maintain a coherent flow throughout the document.
        5. Correct any grammatical errors or improve the language where necessary.
        6. The contents are the text segments that user crawled from other websites.
        7. Create the entire document from the text segmenets by organizing them.
        `;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.",
      },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(generatedNoteSchema, "document"),
  });
  const generatedContent = response.choices[0].message.parsed;

  if (!generatedContent) {
    return { error: "No generated content" };
  }

  return { data: generatedContent };
};
