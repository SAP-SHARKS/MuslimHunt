import { Product } from '../types';

/**
 * Search products by name, tagline, description, and category
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.tagline,
      product.description,
      product.category,
      product.halal_status
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-emerald-100 text-emerald-900">$1</mark>');
}

/**
 * Formats numbers into compact strings (e.g., 1500 -> 1.5k)
 */
export function formatCompactNumber(number: number): string {
  if (number === undefined || number === null) return '0';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number);
}

// Added slugify helper to fix missing export error in App.tsx
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

// Added findProductBySlug helper to fix missing export error in App.tsx
export function findProductBySlug(products: Product[], slug: string): Product | null {
  return products.find(p => slugify(p.name) === slug) || null;
}
