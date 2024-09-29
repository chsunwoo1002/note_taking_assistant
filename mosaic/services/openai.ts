"use server";

import { getNote, getNoteContents } from "@/utils/supabase/note";
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
      .filter((content) => content.content !== null)
      .map((content) => {
        return {
          content: content.content,
          contentId: content.id,
        };
      })
  );
  if (generatedNoteResult.error) {
    return { error: generatedNoteResult.error };
  }

  return { data: generatedNoteResult.data };
};

export const generateNoteResult = async (
  title: string,
  instruction: string | null,
  contents: { content: string | null; contentId: string }[]
) => {
  const contentIds = contents.map((content) => content.contentId) as [
    string,
    ...string[],
  ];

  if (contentIds.length === 0) {
    return { error: "No content" };
  }

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
        reference: z.array(z.enum(contentIds)),
      })
    ),
  });
  const prompt = `
Title: ${title}

Content:
${contents
  .map(
    (content, idx) =>
      `${idx + 1}. [Content ID: ${content.contentId}]\n${content.content}`
  )
  .join("\n\n")}

User Instruction: ${instruction || "No instruction"}

Based on the above title and content, please create a well-structured document. The document should:
1. Start with an introduction that explains the main topic.
2. Organize the content into logical sections with appropriate headings.
   a. Maximum depth of sections is 5.
   b. Divide the sections based on context.
   c. Maximum word count for each section is 200 words.
3. Include a brief conclusion or summary at the end.
4. Maintain a coherent flow throughout the document.
5. Correct any grammatical errors or improve the language where necessary.
6. The contents are text segments that the user collected from other websites.
7. Create the entire document by organizing these text segments.
8. **For each part of the document, include a "reference" field containing the Content IDs of the sources used.**
9. **Only use the contents provided; do not add any new information or external content.**
10. **Do not include the Content IDs or any references within the "content" field. Ensure that the "content" field contains only the textual content without any source identifiers or Content IDs.**
11. **When quoting or referring to specific content, rephrase it in your own words without mentioning the Content IDs in the text.**

Example Output Format:

{
  "contents": [
    {
      "type": "heading1",
      "content": "Introduction to AI-generated Content",
      "reference": []
    },
    {
      "type": "paragraph",
      "content": "Artificial intelligence has revolutionized the way we generate content. Models like GPT-4 can produce human-like text.",
      "reference": ["content-id-2","content-id-3"]
    },
 
  ]
}
`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content. Ensure all parts of the document are derived solely from the provided contents and include references to the Content IDs in the 'reference' field only. Do not include Content IDs or any references within the 'content' field.",
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
