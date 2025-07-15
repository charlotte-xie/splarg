import React, { cloneElement, isValidElement, ReactElement, ReactNode, Ref, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  offset?: { top?: number; left?: number };
  children: ReactElement;
}

export default function Tooltip({ content, offset = { top: -60, left: 0 }, children }: TooltipProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({ position: 'fixed', zIndex: 2147483647, opacity: 0, pointerEvents: 'none' });

  if (!portalRef.current) {
    portalRef.current = document.createElement('div');
  }

  useEffect(() => {
    const el = portalRef.current!;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (visible && triggerRef.current && portalRef.current) {
      // Render off-screen for measurement
      portalRef.current.style.visibility = 'hidden';
      portalRef.current.style.display = 'block';
      portalRef.current.style.position = 'fixed';
      portalRef.current.style.left = '-9999px';
      portalRef.current.style.top = '-9999px';
      const tooltipRect = portalRef.current.getBoundingClientRect();
      portalRef.current.style.visibility = '';
      portalRef.current.style.display = '';

      const rect = triggerRef.current.getBoundingClientRect();
      let top = rect.top + (offset.top ?? 0);
      let left = rect.left + rect.width / 2 + (offset.left ?? 0);

      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      left = Math.max(tooltipWidth / 2, Math.min(left, viewportWidth - tooltipWidth / 2));
      if (top < 0) top = 0;
      if (top + tooltipHeight > viewportHeight) top = viewportHeight - tooltipHeight;

      setStyle({
        position: 'fixed',
        top,
        left,
        transform: 'translateX(-50%)',
        zIndex: 2147483647,
        opacity: 1,
        pointerEvents: 'auto',
      });
    } else {
      setStyle({ position: 'fixed', zIndex: 2147483647, opacity: 0, pointerEvents: 'none' });
    }
  }, [visible, offset]);

  // Only pass ref if the child is a DOM element (string type)
  let childWithProps = children;
  if (isValidElement(children) && typeof children.type === 'string') {
    childWithProps = cloneElement(children, {
      ref: triggerRef as Ref<any>,
      onMouseEnter: () => setVisible(true),
      onMouseLeave: () => setVisible(false),
      onFocus: () => setVisible(true),
      onBlur: () => setVisible(false),
    } as any);
  } else {
    childWithProps = cloneElement(children, {
      onMouseEnter: () => setVisible(true),
      onMouseLeave: () => setVisible(false),
      onFocus: () => setVisible(true),
      onBlur: () => setVisible(false),
    } as any);
  }

  return (
    <>
      {childWithProps}
      {createPortal(
        <div style={style}>
          {content}
        </div>,
        portalRef.current
      )}
    </>
  );
} 