import { Category } from '@/types';
import categoriesData from '@/categories.json';

// カテゴリデータのみ静的にインポート（軽量）
export const categories: Category[] = categoriesData as Category[];
