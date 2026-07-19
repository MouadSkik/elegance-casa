import { promises as fs } from 'fs';
import path from 'path';
import { categories } from '@/data/categories';
import type { Product } from '@/lib/types';

// This module does real filesystem I/O (fs, path) and must only ever be
// imported from Server Components, Route Handlers, or Server Actions —
// never from a file marked 'use client'. Client components should receive
// products as props instead (see app/page.tsx).

const DATA_FILE = path.join(process.cwd(), 'src/data/products.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const VALID_CATEGORIES = new Set<string>(categories.map((c) => c.slug));

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

export interface StoreActionResult {
  success: boolean;
  message: string;
  product?: Product;
}

// --- Reads ---

export async function getProducts(): Promise<Product[]> {
  const text = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(text) as Product[];
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

export async function addProductEntry(formData: FormData): Promise<StoreActionResult> {
  const name = String(formData.get('name') ?? '').trim();
  const idRaw = String(formData.get('id') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const priceRaw = String(formData.get('price') ?? '').trim();
  const material = String(formData.get('material') ?? '').trim();
  const sizesRaw = String(formData.get('sizes') ?? '').trim();
  const imageFile = formData.get('image');

  if (!name) return { success: false, message: 'Le nom du produit est requis.' };
  if (!idRaw) return { success: false, message: "L'ID / slug du produit est requis." };
  if (!material) return { success: false, message: 'La formulation de la matière est requise.' };

  const id = slugify(idRaw);
  if (!id) {
    return { success: false, message: "L'ID / slug doit contenir au moins une lettre ou un chiffre." };
  }

  if (!VALID_CATEGORIES.has(category)) {
    return { success: false, message: 'Catégorie invalide.' };
  }

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price <= 0) {
    return { success: false, message: 'Le prix doit être un nombre positif.' };
  }

  const sizes = sizesRaw
    ? sizesRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const products = await getProducts();
  if (products.some((p) => p.id === id)) {
    return { success: false, message: `L'ID "${id}" existe déjà dans le catalogue — choisissez-en un autre.` };
  }

  // --- Image: save the dropped file, derive its public path ---
  let imagePath: string | null = null;
  if (imageFile instanceof File && imageFile.size > 0) {
    const ext = ALLOWED_IMAGE_TYPES[imageFile.type];
    if (!ext) {
      return { success: false, message: "Format d'image non supporté (utilisez PNG, JPG ou WebP)." };
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return { success: false, message: "L'image dépasse la taille maximale de 8 Mo." };
    }

    const baseName = slugify(imageFile.name.replace(/\.[^/.]+$/, '')) || id;
    const categoryDir = path.join(PUBLIC_DIR, 'products', category);
    await fs.mkdir(categoryDir, { recursive: true });

    let fileName = `${baseName}.${ext}`;
    let counter = 1;
    while (
      await fs.access(path.join(categoryDir, fileName)).then(() => true).catch(() => false)
    ) {
      fileName = `${baseName}-${counter}.${ext}`;
      counter += 1;
    }

    const bytes = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(path.join(categoryDir, fileName), bytes);
    imagePath = `/products/${category}/${fileName}`;
  }

  const newProduct: Product = {
    id,
    name,
    category: category as Product['category'],
    price,
    material,
    image: imagePath,
    sizes,
  };

  products.push(newProduct);
  await writeAll(products);

  return {
    success: true,
    message: `"${name}" (${id}) a été ajouté au catalogue.`,
    product: newProduct,
  };
}

// --- Write: delete ---

export async function deleteProductEntry(identifier: string): Promise<StoreActionResult> {
  const needle = identifier.trim().toLowerCase();
  if (!needle) {
    return { success: false, message: 'Indiquez un nom de produit ou un ID / slug.' };
  }

  const products = await getProducts();
  const index = products.findIndex(
    (p) => p.id.toLowerCase() === needle || p.name.toLowerCase() === needle
  );

  if (index === -1) {
    return { success: false, message: `Aucun produit ne correspond à "${identifier}".` };
  }

  const [removed] = products.splice(index, 1);
  await writeAll(products);

  // Best-effort cleanup of the associated image — never fatal if it fails,
  // and skipped entirely if another surviving product shares the same path.
  if (removed.image && !products.some((p) => p.image === removed.image)) {
    try {
      await fs.unlink(path.join(PUBLIC_DIR, removed.image));
    } catch {
      // Non-fatal: the catalogue entry is already gone either way.
    }
  }

  return {
    success: true,
    message: `"${removed.name}" (${removed.id}) a été retiré du catalogue.`,
    product: removed,
  };
}
