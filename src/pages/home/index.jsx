import { Button } from '@/components/ui/button';
import Layout from '@/pages/common/components/Layout';
import React from 'react';
import { authStatusType } from '../common/components/Layout';

function Home() {
  return (
    <Layout authStatus={authStatusType.NEED_LOGIN}>
      <div className="font-bold">Home</div>
      <Button className="bg-blue-300">Button</Button>
    </Layout>
  );
}

export default Home;
