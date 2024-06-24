import { useEffect, useRef } from "react";

const usePreventDragOnHorizontalScroll = (containerRef) => {
    const touchStartRef = useRef({ x: 0, y: 0, scrollLeft: 0 });

    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                scrollLeft: containerRef.current.scrollLeft,
            };
        };

        const handleTouchMove = (e) => {
            const touchMoveX = e.touches[0].clientX;
            const touchMoveY = e.touches[0].clientY;
            const diffX = Math.abs(touchMoveX - touchStartRef.current.x);
            const diffY = Math.abs(touchMoveY - touchStartRef.current.y);

            const container = containerRef.current;
            if (!container) return;

            const scrollDiffX = Math.abs(container.scrollLeft - touchStartRef.current.scrollLeft);

            // Only prevent drag action if scrolling horizontally
            if (diffX > diffY && scrollDiffX >= 10) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const element = containerRef.current;

        if (element) {
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        return () => {
            if (element) {
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchmove', handleTouchMove);
            }
        };
    }, [containerRef]);

    return touchStartRef;
};

export default usePreventDragOnHorizontalScroll;
