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

    return data.map((row: any) => {
      const productId = row["ID (SKU)"] || row.id;
      return {
        id: productId,
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
      };
    });
  } catch (error) {
    console.error('Error fetching Supabase parameters:', error);
    return [];
  }
}

// 2. ADD PRODUCT + LARGE EMBEDDED DATA IMAGE COMPRESSION
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

    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64String = Buffer.from(buffer).toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64String}`;
    }

    // 🌟 FIXED: Writes to your exact primary Excel-imported column row structure keys!
    const { error } = await supabase.from('products').insert([{
      "ID (SKU)": finalId,
      "Nom du produit": name,
      "Catgorie (slug)": category,
      "Prix (MAD)": price,
      "Matire": material,
      "Chemin image": imageUrl,
      "Tailles disponibles": sizesStr,
      "Prix estim ?": "Non"
    }]);

    if (error) throw error;
    return { success: true, message: `Succès ! La pièce "${name}" est désormais visible sur votre boutique live.` };
  } catch (error: any) {
    return { success: false, message: `Erreur d'enregistrement : ${error.message || error}` };
  }
}

// 3. FIXED DELETION ROUTINE TARGETING EXACT EXCEL KEYS SIGNATURES
export async function deleteProductEntry(identifier: string): Promise<StoreActionResult> {
  try {
    if (!identifier) return { success: false, message: 'Veuillez fournir un nom ou un ID valide.' };
    const searchTarget = identifier.trim().toLowerCase();

    const allProducts = await getProducts();
    const matchedItem = allProducts.find(
      p => p.id.toLowerCase() === searchTarget || p.name.toLowerCase() === searchTarget
    );

    if (!matchedItem) {
      return { success: false, message: `Aucune pièce trouvée correspondant à "${identifier}".` };
    }

    // 🌟 FIXED: Targets the exact structural column string key string name used by your CSV upload!
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('ID (SKU)', matchedItem.id);

    if (error) {
      console.error("Supabase Deletion Error Logs:", error);
      return { success: false, message: `Détails Supabase: ${error.message || JSON.stringify(error)}` };
    }
    
    return { success: true, message: `La pièce "${matchedItem.name}" a été définitivement supprimée.` };
  } catch (error: any) {
    return { success: false, message: `Erreur lors de la suppression : ${error.message || error}` };
  }
}
