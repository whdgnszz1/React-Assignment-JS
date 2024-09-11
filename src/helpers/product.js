import { categories } from '@/constants';

export const createNewProduct = (product, imageUrl) => ({
  ...product,
  price: Number(product.price),
  creationAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: categories.find((cat) => cat.id === product.categoryId),
  image: imageUrl,
});

export const initialProductState = {
  title: '',
  price: '',
  description: '',
  categoryId: '',
  image: null,
};
