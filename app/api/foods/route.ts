import { NextRequest, NextResponse } from 'next/server';
import { getTagKeyForCategory } from '@/lib/utils';
import { getOriginalTagValue } from '@/lib/tag-mapping';
import { Food } from '@/types';

// 元のfood-list.jsonを使用（タグ値が元の長い名前のため）
async function getFoods(): Promise<Food[]> {
  const fs = await import('fs');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'food-list.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as Food[];
}

// メモリキャッシュ
let cachedFoods: Food[] | null = null;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const mediumCategory = searchParams.get('mediumCategory');
  const count = parseInt(searchParams.get('count') || '3', 10);

  if (!categoryId || !mediumCategory) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const categoryIdNum = parseInt(categoryId, 10);
  const tagKey = getTagKeyForCategory(categoryIdNum);

  if (!tagKey) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  // キャッシュからデータを取得
  if (!cachedFoods) {
    cachedFoods = await getFoods();
  }

  // 短縮名を元のタグ値に変換
  const originalTagValue = getOriginalTagValue(categoryIdNum, mediumCategory);

  // フィルタリング
  const filteredFoods = cachedFoods.filter((food) => food.tags[tagKey] === originalTagValue);

  // ランダムに選択
  const shuffled = [...filteredFoods].sort(() => Math.random() - 0.5);
  const selectedFoods = shuffled.slice(0, Math.min(count, shuffled.length));

  return NextResponse.json(selectedFoods);
}
