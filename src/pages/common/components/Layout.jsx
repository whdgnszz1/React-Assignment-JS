import React from 'react';

const Layout = ({ children, containerClassName }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">
        <div className={`container mx-auto px-4 ${containerClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
