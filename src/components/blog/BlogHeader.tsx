
import React from 'react';
import { Separator } from '@/components/ui/separator';

const BlogHeader = () => {
  return (
    <>
      <section className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Découvrez nos derniers articles et conseils pour bien choisir votre forfait mobile ou box internet.
        </p>
      </section>
      
      <Separator className="my-8" />
    </>
  );
};

export default BlogHeader;
