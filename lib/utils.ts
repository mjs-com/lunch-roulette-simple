import { Food } from '@/types';

// 大カテゴリIDに対応するタグキーを取得
export function getTagKeyForCategory(categoryId: number): keyof Food['tags'] | null {
  const tagKeyMap: Record<number, keyof Food['tags']> = {
    1: 'nationality',
    2: 'style',
    3: 'taste',
    4: 'ingredient',
    5: 'cooking',
    6: 'condition',
    7: 'situation',
    8: 'season', // 旧id:9の季節カテゴリが新id:8になった
  };
  return tagKeyMap[categoryId] || null;
}
