import { ChevronDown, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { Button } from '@/components/ui/button';
import { selectIsLogin, selectUser } from '@/store/auth/authSelectors';
import { selectCart } from '@/store/cart/cartSelectors';
import { addCartItem } from '@/store/cart/cartSlice';
import { selectFilter } from '@/store/filter/filterSelectors';
import { loadProducts } from '@/store/product/productsActions';
import {
  selectHasNextPage,
  selectIsLoading,
  selectLastVisible,
  selectProducts,
} from '@/store/product/productsSelectors';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { EmptyProduct } from './EmptyProduct';
import { ProductCard } from './ProductCard';
import { ProductRegistrationModal } from './ProductRegistrationModal';

const PRODUCT_PAGE_LIMIT = 20;

export const ProductList = ({ limit = PRODUCT_PAGE_LIMIT }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = useSelector(selectProducts);
  const lastVisibleId = useSelector(selectLastVisible);
  const hasNextPage = useSelector(selectHasNextPage);
  const isLoading = useSelector(selectIsLoading);
  const filter = useSelector(selectFilter);
  const user = useSelector(selectUser);
  const isLogin = useSelector(selectIsLogin);
  const cart = useSelector(selectCart);

  const loadProductsData = useCallback(
    (isInitial = false) => {
      dispatch(loadProducts({ filter, lastVisibleId, limit, isInitial }));
    },
    [dispatch, filter, lastVisibleId, limit]
  );

  useEffect(() => {
    loadProductsData(true);
  }, [loadProductsData, filter]);

  const handleClickCart = useCallback(
    (ev, product) => {
      ev.stopPropagation();
      if (isLogin) {
        dispatch(addCartItem({ item: product, userId: user.id, count: 1 }));
        console.log(`${product.title}상품이 \n장바구니에 담겼습니다.`);
      } else {
        navigate(pageRoutes.login);
      }
    },
    [dispatch, isLogin, user, navigate]
  );

  const handleClickPurchase = useCallback(
    (ev, product) => {
      ev.stopPropagation();
      if (isLogin) {
        dispatch(addCartItem({ item: product, userId: user.id, count: 1 }));
        navigate(pageRoutes.cart);
      } else {
        navigate(pageRoutes.login);
      }
    },
    [dispatch, isLogin, user, navigate]
  );

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const renderContent = () => {
    if (isLoading && products.length === 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return <EmptyProduct onAddProduct={handleOpenModal} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id}_${index}`}
              product={product}
              onClickAddCartButton={handleClickCart}
              onClickPurchaseButton={handleClickPurchase}
            />
          ))}
        </div>
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => loadProductsData()} disabled={isLoading}>
              {isLoading ? '로딩 중...' : '더 보기'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mt-4">
        <Button onClick={handleOpenModal}>
          <Plus className="mr-2 h-4 w-4" /> 상품 등록
        </Button>
      </div>
      {renderContent()}
      <ProductRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
