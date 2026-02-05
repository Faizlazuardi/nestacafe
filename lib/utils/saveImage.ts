import { supabase } from "./supabase";

export async function saveImage(file: File) {
    if (!file) {
        return undefined
    }
    const { data, error } = await supabase.storage
        .from('Product')
        .upload(`${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
        });
    if (error) {
        throw new Error("Failed to upload image: " + error.message);
    }
    const { data: Photo } = supabase.storage
        .from('Product')
        .getPublicUrl(data.path);
    return Photo.publicUrl;
}
