import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';

export const authStatusType = {
  NEED_LOGIN: 'NEED_LOGIN',
  NEED_NOT_LOGIN: 'NEED_NOT_LOGIN',
  COMMON: 'COMMON',
};

const Layout = ({
  children,
  containerClassName,
  authStatus = authStatusType.COMMON,
}) => {
  const { isLogin } = useSelector((state) => state.auth);

  if (authStatus === authStatusType.NEED_LOGIN && !isLogin) {
    return <Navigate to={pageRoutes.login} />;
  }

  if (authStatus === authStatusType.NEED_NOT_LOGIN && isLogin) {
    return <Navigate to={pageRoutes.main} />;
  }

  return (
    <div className="flex flex-col min-h-screen mt-12">
      <main className="flex-grow">
        <div className={`container mx-auto px-4 ${containerClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
