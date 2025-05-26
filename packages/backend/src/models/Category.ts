export interface Category {
  id: string;
  name: string;
  categoryId: number;
}

import { Schema, model, Document } from 'mongoose';

export interface CategoryDoc extends Omit<Category, 'id'>, Document {}

const CategorySchema = new Schema<CategoryDoc>({
  name: { type: String, required: true },
  categoryId: { type: Number, required: true },
});

export const CategoryModel = model<CategoryDoc>('Category', CategorySchema);
