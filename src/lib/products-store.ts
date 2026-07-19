'use server';

import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/lib/types';

export type StoreActionResult = { success: boolean; message: string };

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
export async function addProductEntry(formData: FormData): Promise<StoreActionResult> {
  try {
    const name = String(formData.get('name') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const price = Number(formData.get('price') ?? 0);
    const material = String(formData.get('material') ?? '').trim();
    const sizesStr = String(formData.get('sizes') ?? '').trim();
    
    if (!name || !price || !category) {
      return { success: false, message: 'Veuillez remplir les champs obligatoires (Nom, Prix, Catégorie).' };
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { error } = await supabase.from('products').insert([{
      "ID (SKU)": id,
      "Nom du produit": name,
      "Catgorie (slug)": category,
      "Prix (MAD)": price,
      "Matire": material,
      "Chemin image": '/products/Logo.png',
      "Tailles disponibles": sizesStr,
      "Prix estim ?": "Non"
    }]);

    if (error) throw error;

    return { success: true, message: `Succès ! La pièce "${name}" est enregistrée.` };
  } catch (error) {
    return { success: false, message: `Erreur d'enregistrement : ${error}` };
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
