import { ChevronDown, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { Button } from '@/components/ui/button';
import { extractIndexLink, isFirebaseIndexError } from '@/helpers/error';
import { useModal } from '@/hooks/useModal';
import { FirebaseIndexErrorModal } from '@/pages/error/components/FirebaseIndexErrorModal';

import { selectIsLogin, selectUser } from '@/store/auth/authSelectors';
import { selectCart } from '@/store/cart/cartSelectors';
import { addCartItem } from '@/store/cart/cartSlice';
import { selectFilter } from '@/store/filter/filterSelectors';
import { loadProducts } from '@/store/product/productsActions';
import {
  selectHasNextPage,
  selectIsLoading,
  selectProducts,
  selectTotalCount,
} from '@/store/product/productsSelectors';

import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { EmptyProduct } from './EmptyProduct';
import { ProductCard } from './ProductCard';
import { ProductRegistrationModal } from './ProductRegistrationModal';

const PRODUCT_PAGE_SIZE = 3;

export const ProductList = ({ pageSize = PRODUCT_PAGE_SIZE }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] = useState(false);
  const [indexLink, setIndexLink] = useState(null);

  const products = useSelector(selectProducts);
  const hasNextPage = useSelector(selectHasNextPage);
  const isLoading = useSelector(selectIsLoading);
  const filter = useSelector(selectFilter);
  const user = useSelector(selectUser);
  const isLogin = useSelector(selectIsLogin);
  const cart = useSelector(selectCart);
  const totalCount = useSelector(selectTotalCount);

  const loadProductsData = useCallback(
    async (isInitial = false) => {
      try {
        const page = isInitial ? 1 : currentPage + 1;
        await dispatch(
          loadProducts({
            filter,
            pageSize,
            page,
            isInitial,
          })
        ).unwrap();
        if (!isInitial) {
          setCurrentPage(page);
        }
      } catch (error) {
        if (isFirebaseIndexError(error)) {
          const link = extractIndexLink(error);
          setIndexLink(link);
          setIsIndexErrorModalOpen(true);
        }
        throw error;
      }
    },
    [dispatch, filter, pageSize, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
    loadProductsData(true);
  }, [filter]);

  const handleCartAction = useCallback(
    (product) => {
      if (isLogin) {
        dispatch(addCartItem({ item: product, userId: user.id, count: 1 }));
        console.log(`${product.title} 상품이 \n장바구니에 담겼습니다.`);
      } else {
        navigate(pageRoutes.login);
      }
    },
    [dispatch, isLogin, user, navigate]
  );

  const handlePurchaseAction = useCallback(
    (product) => {
      if (isLogin) {
        dispatch(addCartItem({ item: product, userId: user.id, count: 1 }));
        navigate(pageRoutes.cart);
      } else {
        navigate(pageRoutes.login);
      }
    },
    [dispatch, isLogin, user, navigate]
  );

  const handleProductAdded = useCallback(() => {
    setCurrentPage(1);
    loadProductsData(true);
  }, [loadProductsData]);

  const renderProductCards = useMemo(
    () =>
      products.map((product, index) => (
        <ProductCard
          key={`${product.id}_${index}`}
          product={product}
          onClickAddCartButton={(ev) => {
            ev.stopPropagation();
            handleCartAction(product);
          }}
          onClickPurchaseButton={(ev) => {
            ev.stopPropagation();
            handlePurchaseAction(product);
          }}
        />
      )),
    [products, handleCartAction, handlePurchaseAction]
  );

  const renderContent = () => {
    if (isLoading && products.length === 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(pageSize)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return <EmptyProduct onAddProduct={openModal} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderProductCards}
        </div>
        {hasNextPage && currentPage * pageSize < totalCount && (
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
        <Button onClick={openModal}>
          <Plus className="mr-2 h-4 w-4" /> 상품 등록
        </Button>
      </div>
      {renderContent()}
      <ProductRegistrationModal
        isOpen={isOpen}
        onClose={closeModal}
        onProductAdded={handleProductAdded}
      />
      <FirebaseIndexErrorModal
        isOpen={isIndexErrorModalOpen}
        onClose={() => setIsIndexErrorModalOpen(false)}
        indexLink={indexLink}
      />
    </div>
  );
};
