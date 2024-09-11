import { db } from '@/firebase';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
} from 'firebase/firestore';

export const fetchProducts = async (filter, lastVisibleId, pageLimit) => {
  try {
    let q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );

    if (filter.categoryId && filter.categoryId !== '-1') {
      q = query(q, where('category.id', '==', filter.categoryId));
    }
    if (filter.title) {
      q = query(
        q,
        where('title', '>=', filter.title),
        where('title', '<=', filter.title + '\uf8ff')
      );
    }
    if (filter.minPrice) {
      q = query(q, where('price', '>=', Number(filter.minPrice)));
    }
    if (filter.maxPrice) {
      q = query(q, where('price', '<=', Number(filter.maxPrice)));
    }

    if (lastVisibleId) {
      const lastVisibleDoc = await doc(db, 'products', lastVisibleId);
      q = query(q, startAfter(lastVisibleDoc));
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));
    const newLastVisibleId =
      querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
    const hasNextPage = querySnapshot.docs.length === pageLimit;

    return { products, newLastVisibleId, hasNextPage };
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error;
  }
};

export const addProductAPI = async (productData) => {
  try {
    const productRef = collection(db, 'products');
    const newProductData = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(productRef, newProductData);
    const newProduct = {
      id: docRef.id,
      ...newProductData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newProduct;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};
