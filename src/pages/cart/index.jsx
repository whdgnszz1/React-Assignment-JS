import React from 'react';
import { useSelector } from 'react-redux';
import CartTable from '@/pages/cart/components/CartTable';
import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import Layout, { authStatusType } from '@/pages/common/components/Layout';
import { selectCart } from '@/store/cart/cartSelectors';

const Cart = () => {
  const cart = useSelector(selectCart);
  const isExist = cart.length > 0;

  return (
    <Layout
      className="p-2.5 flex flex-col"
      authStatus={authStatusType.NEED_LOGIN}
    >
      {isExist ? <CartTable /> : <EmptyNotice />}
    </Layout>
  );
};

export default Cart;
