import { NextRequest, NextResponse } from 'next/server';
import { getTagKeyForCategory } from '@/lib/utils';
import { getOriginalTagValue } from '@/lib/tag-mapping';
import { Food } from '@/types';
import foodListData from '@/food-list.json';

// food-list.jsonを直接インポート（ビルド時にバンドルに含まれる）
const foods: Food[] = foodListData as Food[];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const mediumCategory = searchParams.get('mediumCategory');
    const count = parseInt(searchParams.get('count') || '3', 10);

    if (!categoryId || !mediumCategory) {
      return NextResponse.json(
        { error: 'Missing parameters', details: 'categoryId and mediumCategory are required' },
        { status: 400 }
      );
    }

    const categoryIdNum = parseInt(categoryId, 10);
    const tagKey = getTagKeyForCategory(categoryIdNum);

    if (!tagKey) {
      return NextResponse.json(
        { error: 'Invalid category', details: `Category ID ${categoryIdNum} is not valid` },
        { status: 400 }
      );
    }

    // 短縮名を元のタグ値に変換
    const originalTagValue = getOriginalTagValue(categoryIdNum, mediumCategory);

    // フィルタリング
    const filteredFoods = foods.filter((food) => food.tags[tagKey] === originalTagValue);

    if (filteredFoods.length === 0) {
      return NextResponse.json(
        { 
          error: 'No foods found', 
          details: `No foods found for category ${categoryIdNum} with tag ${originalTagValue}` 
        },
        { status: 404 }
      );
    }

    // ランダムに選択
    const shuffled = [...filteredFoods].sort(() => Math.random() - 0.5);
    const selectedFoods = shuffled.slice(0, Math.min(count, shuffled.length));

    return NextResponse.json(selectedFoods);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
