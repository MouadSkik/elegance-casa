import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/lib/types';

export type StoreActionResult = { success: boolean; message: string };

// Connects your live code directly to your Supabase Cloud Database metrics
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- Reads ---

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    if (!data) return [];

    // Map clean database columns back to your TypeScript frontend schema attributes
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      material: row.material || "Plaqué or 18 carats",
      image: row.image || "/products/Logo.png",
      sizes: row.sizes ? (typeof row.sizes === 'string' ? row.sizes.split(',').map((s: string) => s.trim()) : row.sizes) : [],
      priceEstimated: row.price_estimated === "Oui" || row.price_estimated === true
    }));
  } catch (error) {
    console.error('Error fetching Supabase catalogue parameters:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}

async function writeAll(products: Product[]): Promise<void> {
  const text = JSON.stringify(products, null, 2) + '\n';
  await fs.writeFile(DATA_FILE, text, 'utf8');
}

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (é -> e, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// --- Write: add ---

// Add a newly submitted piece via the Admin Dashboard Form using clean columns
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
      id,
      name,
      category,
      price,
      material,
      image: '/products/Logo.png',
      sizes: sizesStr,
      price_estimated: "Non"
    }]);

    if (error) throw error;

    return { success: true, message: `Succès ! La pièce "${name}" est enregistrée.` };
  } catch (error) {
    return { success: false, message: `Erreur : ${error}` };
  }
}

// Complete deletion cleanup loop
export async function deleteProductEntry(identifier: string): Promise<StoreActionResult> {
  try {
    if (!identifier) return { success: false, message: 'Veuillez fournir un nom ou un ID valide.' };
    const searchTarget = identifier.trim();

    const { error } = await supabase
      .from('products')
      .delete()
      .or(`id.ilike.${searchTarget},name.ilike.${searchTarget}`);

    if (error) throw error;

    return { success: true, message: 'La pièce a été retirée définitivement de votre base de données Supabase.' };
  } catch (error) {
    return { success: false, message: `Erreur lors de la suppression : ${error}` };
  }
}
