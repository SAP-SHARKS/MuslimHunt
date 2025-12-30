
import { Product, Badge } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

export interface CategoryItem {
  name: string;
  description: string;
}

export interface CategorySection {
  id: string;
  title: string;
  icon: any; 
  items: CategoryItem[];
}

/**
 * Legacy placeholders. 
 * The application now fetches product_categories from Supabase.
 * Components have been refactored to accept categories as props.
 */
export const CATEGORY_SECTIONS: CategorySection[] = [];
export const CATEGORIES: string[] = [];

// Helper for image seeding (retained for mock data generation)
const UNSPLASH_IDS = [
  'photo-1609599006353-e629aaabfeae', 'photo-1584697964400-2af6a2f6204c', 'photo-1517694712202-14dd9538aa97',
  'photo-1557838923-2985c318be48', 'photo-1542816417-0983c9c9ad53', 'photo-1564120029-291750e70391',
  'photo-1591604129939-f1efa4d9f7fa', 'photo-1579621970563-ebec7560ff3e', 'photo-1512621776951-a57141f2eefd',
  'photo-1521737711867-e3b97375f902', 'photo-1556761175-4b46a572b786', 'photo-1590076214667-c0f33b98c422',
  'photo-1633156189757-45430d6c949d', 'photo-1506126613408-eca07ce68773', 'photo-1516979187457-637abb4f9353',
  'photo-1511295742364-917e703b5758', 'photo-1503676260728-1c00da094a0b', 'photo-1542744094-24638eff58bb',
  'photo-1559526324-4b87b5e36e44', 'photo-1456513080510-7bf3a84b82f8', 'photo-1555066931-4365d14bab8c',
  'photo-1498050108023-c5249f4df085', 'photo-1526304640581-d334cdbbf45e', 'photo-1548013146-72479768bbaa',
  'photo-1571019613454-1cb2f99b2d8b', 'photo-1518467166778-b8c6b252b19d', 'photo-1461749280684-dccba630e2f6',
  'photo-1523413363574-c3c444a14c78', 'photo-1567620905732-2d1ec7bb7445', 'photo-1504674900247-0877df9cc836',
  'photo-1511688868353-3a2d5be94cd7',
];

export const INITIAL_PRODUCTS: Product[] = [];
