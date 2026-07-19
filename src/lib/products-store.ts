'use server';

import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/lib/types';

export type StoreActionResult = { success: boolean; message: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. FETCH LIVE DATABASE ENTRIES
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    if (!data) return [];

    return data.map((row: any) => ({
      id: row["ID (SKU)"] || row.id,
      name: row["Nom du produit"] || row.name,
      category: row["Catgorie (slug)"] || row["Catégorie (slug)"] || row.category,
      price: Number(row["Prix (MAD)"] || row.price),
      material: row["Matire"] || row["Matière"] || row.material || "Plaqué or 18 carats",
      image: row["Chemin image"] || row["Chemin du produit"] || row.image || "/products/Logo.png",
      sizes: row["Tailles disponibles"] || row.sizes 
        ? (typeof (row["Tailles disponibles"] || row.sizes) === 'string' 
            ? (row["Tailles disponibles"] || row.sizes).split(',').map((s: string) => s.trim()) 
            : (row["Tailles disponibles"] || row.sizes)) 
        : [],
      priceEstimated: row["Prix estim ?"] === "Oui" || row["Prix estimé ?"] === "Oui" || row.priceEstimated === true
    }));
  } catch (error) {
    console.error('Error fetching Supabase parameters:', error);
    return [];
  }
}

// 2. ADD PRODUCT + ENCODE IMAGE ATTACHMENT DYNAMICALLY
export async function addProductEntry(formData: FormData): Promise<StoreActionResult> {
  try {
    const name = String(formData.get('name') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const price = Number(formData.get('price') ?? 0);
    const material = String(formData.get('material') ?? '').trim();
    const sizesStr = String(formData.get('sizes') ?? '').trim();
    const customId = String(formData.get('id') ?? '').trim();
    const imageFile = formData.get('image') as File | null;
    
    if (!name || !price || !category) {
      return { success: false, message: 'Veuillez remplir les champs obligatoires (Nom, Prix, Catégorie).' };
    }

    const finalId = customId || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let imageUrl = '/products/Logo.png';

    // Convert file attachments directly into a secure text string data token
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64String = Buffer.from(buffer).toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64String}`;
    }

    const { error } = await supabase.from('products').insert([{
      id: finalId,
      name: name,
      category: category,
      price: price,
      material: material,
      image: imageUrl,
      sizes: sizesStr,
      price_estimated: true,
      on_sale: "Non",
      is_new: "Oui"
    }]);

    if (error) throw error;
    return { success: true, message: `Succès ! La pièce "${name}" est désormais visible sur votre boutique live avec son image.` };
  } catch (error: any) {
    return { success: false, message: `Erreur d'enregistrement : ${error.message || error}` };
  }
}

// 3. FIXED DELETION SEARCH MATRIX LOOPS
export async function deleteProductEntry(identifier: string): Promise<StoreActionResult> {
  try {
    if (!identifier) return { success: false, message: 'Veuillez fournir un nom ou un ID valide.' };
    const searchTarget = identifier.trim().toLowerCase();

    // Fetch the list first to trace the targeted item
    const allProducts = await getProducts();
    const matchedItem = allProducts.find(
      p => p.id.toLowerCase() === searchTarget || p.name.toLowerCase() === searchTarget
    );

    if (!matchedItem) {
      return { success: false, message: `Aucune pièce trouvée correspondant à "${identifier}". Vérifiez l'orthographe.` };
    }

    // Execute absolute target deletion check across database row signatures
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', matchedItem.id);

    if (error) throw error;
    return { success: true, message: `La pièce "${matchedItem.name}" a été définitivement supprimée du catalogue live.` };
  } catch (error: any) {
    return { success: false, message: `Erreur lors de la suppression : ${error.message || error}` };
  }
}
