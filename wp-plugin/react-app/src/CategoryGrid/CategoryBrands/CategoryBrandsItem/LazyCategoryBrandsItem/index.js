import React, { lazy, Suspense } from 'react';
import CategoryBrandsItem from '..';

const LazyCategoryBrandsItem = (props) => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryBrandsItem {...props} lazy/>
    </Suspense>
  );
};

export default LazyCategoryBrandsItem;