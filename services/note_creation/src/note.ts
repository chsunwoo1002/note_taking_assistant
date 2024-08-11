import OpenAI from "openai";

class Note {
  private title: string;
  private content: string[];
  private openai: OpenAI;
  constructor(title: string, openai: OpenAI) {
    console.log("title", title);
    this.title = title;
    this.content = [];
    this.openai = openai;
  }

  addContent(content: string) {
    console.log("content", content);
    this.content.push(content);
  }

  async createNote() {
    const prompt = `
    Title: ${this.title}

    Content:
    ${this.content.join("\n\n")}

    Based on the above title and content, please create a well-structured document. The document should:
    1. Start with an introduction that explains the main topic.
    2. Organize the content into logical sections with appropriate headings.
    3. Include a brief conclusion or summary at the end.
    4. Maintain a coherent flow throughout the document.
    5. Correct any grammatical errors or improve the language where necessary.
    `;
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert writer and organizer, tasked with creating well-structured documents from user-provided content.",
        },
        { role: "user", content: prompt },
      ],
    });
    const generatedContent = response.choices[0].message.content;
    console.log("generatedContent", generatedContent);
    return generatedContent;
  }
}

export default Note;
