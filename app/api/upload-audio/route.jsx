import { supabase } from "@/configs/supabaseClient";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const id = formData.get("id");

    if (!file || !id) {
      console.error("❌ Fichier ou ID manquant :", { file, id });
      return new Response(JSON.stringify({ error: "Missing file or id" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // 🪣 Nom du bucket Supabase
    const bucketName = "audio-files";
    const filePath = `${id}.mp3`;

    console.log(`📤 Upload vers Supabase : bucket=${bucketName}, path=${filePath}`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, arrayBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.error("❌ Erreur upload Supabase :", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log("✅ Upload réussi :", data);

    const { data: publicData, error: publicError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (publicError) {
      console.error("❌ Erreur récupération URL publique :", publicError.message);
      return new Response(JSON.stringify({ error: publicError.message }), { status: 500 });
    }

    console.log("🌍 URL publique :", publicData.publicUrl);

    return new Response(JSON.stringify({ path: publicData.publicUrl }), { status: 200 });
  } catch (err) {
    console.error("❌ Erreur interne dans /api/upload-audio :", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
