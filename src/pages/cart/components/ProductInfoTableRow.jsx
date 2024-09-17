import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { MAX_CART_VALUE } from '@/constants';
import { cartValidationMessages } from '@/messages';
import { changeCartItemCount, removeCartItem } from '@/store/cart/cartSlice';
import { formatPrice } from '@/utils/formatter';

export const ProductInfoTableRow = ({ item, user }) => {
  const dispatch = useDispatch();
  const { id, title, count, image, price } = item;

  const handleClickDeleteItem = () => {
    dispatch(removeCartItem({ itemId: id, userId: user.id }));
  };

  const handleChangeCount = (event) => {
    const newCount = Number(event.target.value);

    if (newCount > MAX_CART_VALUE) {
      alert(cartValidationMessages.MAX_INPUT_VALUE);
      return;
    }

    dispatch(
      changeCartItemCount({ itemId: id, userId: user.id, count: newCount })
    );
  };

  return (
    <TableRow>
      <TableCell className="text-center">
        <img src={image} height="80" alt={title} />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Input
          type="number"
          onChange={handleChangeCount}
          value={count}
          className="w-20"
        />
      </TableCell>
      <TableCell>{formatPrice(price * count)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={handleClickDeleteItem}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
