import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";

const server = app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

// let doc: Note;

// const openai = new OpenAI({
//   apiKey: env.OPENAI_API_KEY,
//   organization: process.env.OPENAI_ORGANIZATION,
// });

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Basic route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.post("/document/title", (req: Request, res: Response) => {
//   const { title } = req.body;
//   doc = new Note(title as string, openai);
//   res.send(`Document created: ${title}`);
// });

// app.post("/document/content", (req: Request, res: Response) => {
//   const { content } = req.body;
//   doc.addContent(content);
//   res.send(`Document created: ${content}`);
// });

// app.get("/document", async (req: Request, res: Response) => {
//   const a = await doc.createNote();
//   console.log(a);
//   res.send({ result: a });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
