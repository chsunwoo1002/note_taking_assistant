import express from "express";
import type { Express, Request, Response } from "express";
import Note from "./note";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port = 3000;

let doc: Note;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/document/title", (req: Request, res: Response) => {
  const { title } = req.body;
  doc = new Note(title as string, openai);
  res.send(`Document created: ${title}`);
});

app.post("/document/content", (req: Request, res: Response) => {
  const { content } = req.body;
  doc.addContent(content);
  res.send(`Document created: ${content}`);
});

app.get("/document", async (req: Request, res: Response) => {
  const a = await doc.createNote();
  console.log(a);
  res.send({ result: a });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
