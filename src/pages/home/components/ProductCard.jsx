import React from 'react';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { pathToUrl } from '@/helpers/url';
import { formatPrice } from '@/utils/formatter';

export const ProductCard = ({
  product,
  onClickAddCartButton,
  onClickPurchaseButton,
}) => {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const { title, images, price, category, id } = product;

  const handleClickItem = () => {
    navigate(pathToUrl(pageRoutes.productDetail, { productId: id }));
  };
  const handleClickAddCartButton = (ev) => {
    onClickAddCartButton(ev, product);
  };
  const handleClickPurchaseButton = (ev) => {
    onClickPurchaseButton(ev, product);
  };

  return (
    <Card className="cursor-pointer" onClick={handleClickItem}>
      <img src={images?.[0]} alt={title} className="w-full h-40 object-cover" />
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2">
          {category.name}
        </Badge>
        <h3 className="font-bold text-lg line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{formatPrice(price)}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={handleClickAddCartButton}
        >
          장바구니
        </Button>
        <Button size="sm" onClick={handleClickPurchaseButton}>
          구매하기
        </Button>
      </CardFooter>
    </Card>
  );
};
