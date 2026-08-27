import { useCallback, useRef, useState, type PointerEvent } from "react";

export const useDraggable = (initial = { x: 0, y: 0 }) => {
    const [position, setPosition] = useState(initial);
    const dragging = useRef<{ startX: number; startY: number; originX: number; originY: number }>(
        null,
    );

    const onPointerDown = useCallback(
        (event: PointerEvent) => {
            (event.target as HTMLElement).setPointerCapture(event.pointerId);
            dragging.current = {
                startX: event.clientX,
                startY: event.clientY,
                originX: position.x,
                originY: position.y,
            };
        },
        [position],
    );

    const onPointerMove = useCallback((event: PointerEvent) => {
        if (!dragging.current) {
            return;
        }
        const { startX, startY, originX, originY } = dragging.current;
        setPosition({
            x: originX + (event.clientX - startX),
            y: originY + (event.clientY - startY),
        });
    }, []);

    const onPointerUp = useCallback(() => {
        dragging.current = null;
    }, []);

    return {
        position,
        handlers: { onPointerDown, onPointerMove, onPointerUp },
    };
};
