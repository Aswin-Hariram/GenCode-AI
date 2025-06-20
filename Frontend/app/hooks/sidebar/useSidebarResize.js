import { useState, useCallback, useEffect } from 'react';

export default function useSidebarResize(initialWidth = 400, minWidth = 300, maxWidthPercent = 0.45) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleResizeMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    }
  }, [isResizing, sidebarWidth]);

  const handleResizeMouseMove = useCallback((e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      const minWidthPx = minWidth;
      const maxWidthPx = window.innerWidth * maxWidthPercent;
      if (newWidth >= minWidthPx && newWidth <= maxWidthPx) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing, minWidth, maxWidthPercent]);

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      const minWidthPx = minWidth;
      const maxWidthPx = window.innerWidth * maxWidthPercent;
      setSidebarWidth(Math.max(minWidthPx, Math.min(parsedWidth, maxWidthPx)));
    }
  }, [minWidth, maxWidthPercent]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  return {
    sidebarWidth,
    setSidebarWidth,
    isResizing,
    setIsResizing,
    handleResizeMouseDown
  };
}
