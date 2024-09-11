import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/constants';
import { createNewProduct, initialProductState } from '@/helpers/product';
import { addProduct } from '@/store/product/productsActions';
import { uploadImage } from '@/utils/imageUpload';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export const ProductRegistrationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(initialProductState);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const imageUrl = await uploadImage(product.image);
      const newProduct = createNewProduct(product, imageUrl);
      dispatch(addProduct(newProduct));
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }, [product, dispatch, onClose]);

  const handleCategoryChange = useCallback((value) => {
    setProduct((prev) => ({ ...prev, categoryId: value }));
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input name="title" placeholder="상품명" onChange={handleChange} />
          <Input
            name="price"
            type="number"
            placeholder="가격"
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="상품 설명"
            onChange={handleChange}
          />
          <Select name="categoryId" onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
