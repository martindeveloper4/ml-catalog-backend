export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryDto {
  slug: string;
  name: string;
  icon: string;
  sort_order?: number;
  active?: boolean;
}

export interface UpdateCategoryDto {
  slug?: string;
  name?: string;
  icon?: string;
  sort_order?: number;
  active?: boolean;
}
