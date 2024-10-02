import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.45.4";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

Deno.serve(async (req) => {
  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const { content, noteId, sourceUrl, contentType } = await req.json();

  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY")!,
    organization: Deno.env.get("OPENAI_ORGANIZATION")!,
  });

  const vectorResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: content,
  });

  // vector with 1536 dimensions
  const vector = vectorResponse.data[0].embedding;

  const { error } = await supabase.rpc("insert_note_content", {
    p_note_id: noteId,
    p_content: content,
    p_source_url: sourceUrl,
    p_content_type: contentType,
    p_vector: vector,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
