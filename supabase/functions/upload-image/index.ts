import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { multiParser, FormFile } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'

Deno.serve(async (req) => {
  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // Authenticate user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401
    })
  }
  const userId = user.id

  // Parse multipart form data
  const form = await multiParser(req)
  if (!form) {
    return new Response(JSON.stringify({ success: false, error: 'No file found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }

  const image: FormFile = form.files.image as FormFile
  const noteId = form.fields.noteId as string
  const sourceUrl = form.fields.sourceUrl as string

  // Generate a unique file path for the uploaded image
  const fileExtension = image.filename.split('.').pop()
  const fileName = `${Date.now()}.${fileExtension}`
  const filePath = `${userId}/${noteId}/${fileName}`

  // Upload image to Supabase storage
  const { data, error } = await supabase.storage
    .from('note-images')
    .upload(filePath, image.content, {
      cacheControl: '3600',
      upsert: false,
      contentType: image.contentType,
    })

  if (error) {
    return new Response(JSON.stringify({ success: false, error: 'Upload failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }

  const fileUrl = data.path

  // Insert note content into database
  const { error: noteContentError } = await supabase.from('note_contents').insert({
    note_id: noteId,
    file_url: fileUrl,
    source_url: sourceUrl,
    type_id: 2  // represent image type
  })

  if (noteContentError) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to save note content' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
