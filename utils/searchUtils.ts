
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
 * Uses lowercase 'k' and 'm' for a cleaner, high-density look.
 */
export function formatCompactNumber(number: number): string {
  if (number === undefined || number === null) return '0';
  if (number < 1000) return number.toString();
  
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number).toLowerCase();
}

/**
 * Converts a string into a URL-friendly slug
 */
export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * Finds a product in an array by its slugified name
 */
export const findProductBySlug = (products: Product[], slug: string) => {
  return products.find(p => slugify(p.name) === slug);
};
