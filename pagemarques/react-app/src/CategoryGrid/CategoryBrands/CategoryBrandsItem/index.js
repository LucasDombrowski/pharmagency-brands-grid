import clsx from 'clsx';
import React, { forwardRef } from 'react';

const CategoryBrandsItem = forwardRef((props, ref) => {
    return (
        <div ref={ref} className={clsx(
            props.cssClasses.image_container,
            "pagemarques-grid-item transition-all hover:scale-105"
        )}>
            <img
                src={props.png_url ? props.png_url : props.jpg_url}
                alt={props.name}
                className={clsx(
                    "w-full aspect-square object-contain",
                    props.cssClasses.image,
                    "pagemarques-grid-item-image"
                )}
                loading={props.lazy && "lazy"}
            />
        </div>
    );
});

export default CategoryBrandsItem;