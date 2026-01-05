
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
 * Converts a string into a URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

/**
 * Finds a product in the provided array by its name-based slug
 */
export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find(p => slugify(p.name) === slug);
}
