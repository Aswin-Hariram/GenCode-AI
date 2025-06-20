import { useEffect, useCallback } from "react";

export default function useEditorFullscreen(onToggleFullscreen) {
  const handleToggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      console.warn("onToggleFullscreen handler not provided to CodeEditor");
    }
  }, [onToggleFullscreen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        handleToggleFullscreen();
      }
      if (event.key === 'Enter' && event.altKey) {
        event.preventDefault();
        handleToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleFullscreen]);

  return handleToggleFullscreen;
}
