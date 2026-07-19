'use server';

import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/lib/types';

export type StoreActionResult = { success: boolean; message: string };

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. FETCH FROM CLOUD DATABASE
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

// 2. ADD A NEW PRODUCT VIA THE ADMIN DASHBOARD FORM
// Add a newly submitted piece via the Admin Dashboard Form using clean columns
export async function addProductEntry(formData: FormData): Promise<StoreActionResult> {
  try {
    const name = String(formData.get('name') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const price = Number(formData.get('price') ?? 0);
    const material = String(formData.get('material') ?? '').trim();
    const sizesStr = String(formData.get('sizes') ?? '').trim();
    const customId = String(formData.get('id') ?? '').trim(); // Captures the exact ID typed in your form field box
    
    if (!name || !price || !category) {
      return { success: false, message: 'Veuillez remplir les champs obligatoires (Nom, Prix, Catégorie).' };
    }

    // Use the custom ID typed into the form box field, or auto-generate a fallback slug if left empty
    const finalId = customId || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 🌟 FIXED: Passes exact clean lowercase object properties to match your Supabase column definitions!
    const { error } = await supabase.from('products').insert([{
      id: finalId,
      name: name,
      category: category,
      price: price,
      material: material,
      image: '/products/Logo.png', // Default high-end asset placeholder
      sizes: sizesStr,
      price_estimated: "Non",
      on_sale: "Non",
      is_new: "Oui"
    }]);

    if (error) {
      console.error("Supabase Error Details:", error);
      return { success: false, message: `Erreur Supabase: ${error.message || JSON.stringify(error)}` };
    }

    return { success: true, message: `Succès ! La pièce "${name}" a été ajoutée à votre catalogue live.` };
  } catch (error: any) {
    return { success: false, message: `Erreur d'enregistrement : ${error.message || error}` };
  }
}


// 3. COMPLETE DELETION FROM THE CLOUD DATABASE
export async function deleteProductEntry(identifier: string): Promise<StoreActionResult> {
  try {
    if (!identifier) return { success: false, message: 'Veuillez fournir un nom ou un ID valide.' };
    const searchTarget = identifier.trim();

    const { error } = await supabase
      .from('products')
      .delete()
      .or(`"ID (SKU)".ilike.${searchTarget},"Nom du produit".ilike.${searchTarget}`);

    if (error) throw error;

    return { success: true, message: 'La pièce a été retirée définitivement de votre base de données Supabase.' };
  } catch (error) {
    return { success: false, message: `Erreur lors de la suppression : ${error}` };
  }
}
