export type BadgeType = 'popular' | 'new' | 'sale' | 'custom' | 'special';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number;
  badge_text: string | null;
  badge_type: BadgeType | null;
  stock_available: boolean;
  active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductWithCategory extends Product {
  category_slug: string;
  category_name: string;
  category_icon: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: number;
  badge_text?: string;
  badge_type?: BadgeType;
  stock_available?: boolean;
  active?: boolean;
  sort_order?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string | null;
  price?: number;
  image_url?: string | null;
  category_id?: number;
  badge_text?: string | null;
  badge_type?: BadgeType | null;
  stock_available?: boolean;
  active?: boolean;
  sort_order?: number;
}

export interface ProductFilters {
  category_slug?: string;
  search?: string;
  /** undefined = no filter, true = active only, false = inactive only */
  active?: boolean;
  page?: number;
  limit?: number;
}
