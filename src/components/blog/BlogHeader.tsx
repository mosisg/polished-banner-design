
import React from 'react';
import { Separator } from '@/components/ui/separator';
import BlogBanner from './BlogBanner';

const BlogHeader = () => {
  return (
    <>
      <BlogBanner />
      <Separator className="my-8" />
    </>
  );
};

export default BlogHeader;
