import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import React, { Suspense, useCallback } from 'react';

import {
  setCategoryId,
  setMaxPrice,
  setMinPrice,
  setTitle,
} from '@/store/filter/filterActions';
import { selectFilter } from '@/store/filter/filterSelectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { debounce } from '@/utils/common';
import ApiErrorBoundary from '../../common/components/ApiErrorBoundary';
import { CategoryRadioGroup } from './CategoryRadioGroup';
import { PriceRange } from './PriceRange';
import { SearchBar } from './SearchBar';

const ProductFilterBox = ({ children }) => (
  <Card className="my-4">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ProductFilter = () => {
  const dispatch = useAppDispatch();
  const filterState = useAppSelector(selectFilter);

  const handleChangeInput = useCallback(
    debounce((ev) => {
      dispatch(setTitle(ev.target.value));
    }, 300),
    [dispatch]
  );

  const handlePriceChange = useCallback(
    (actionCreator) =>
      debounce((ev) => {
        const value = ev.target.value;
        if (value === '') {
          dispatch(actionCreator(null));
        } else {
          const numericValue = Math.max(0, parseInt(value, 10));
          if (!isNaN(numericValue)) {
            dispatch(actionCreator(numericValue));
          }
        }
      }, 300),
    [dispatch]
  );

  const handleMinPrice = useCallback(handlePriceChange(setMinPrice), [
    handlePriceChange,
  ]);
  const handleMaxPrice = useCallback(handlePriceChange(setMaxPrice), [
    handlePriceChange,
  ]);

  const handleChangeCategory = useCallback(
    (value) => {
      if (value !== undefined) {
        dispatch(setCategoryId(value));
      } else {
        console.error('Category value is undefined');
      }
    },
    [dispatch]
  );

  return (
    <div className="space-y-4">
      <ProductFilterBox>
        <SearchBar onChangeInput={handleChangeInput} />
      </ProductFilterBox>
      <ProductFilterBox>
        <ApiErrorBoundary>
          <Suspense fallback={<Loader2 className="h-24 w-24 animate-spin" />}>
            <CategoryRadioGroup
              categoryId={filterState.categoryId}
              onChangeCategory={handleChangeCategory}
            />
          </Suspense>
        </ApiErrorBoundary>
      </ProductFilterBox>
      <ProductFilterBox>
        <PriceRange
          onChangeMinPrice={handleMinPrice}
          onChangeMaxPrice={handleMaxPrice}
        />
      </ProductFilterBox>
    </div>
  );
};
