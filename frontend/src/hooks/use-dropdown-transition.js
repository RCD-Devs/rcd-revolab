import { useEffect, useState } from "react";

export function useDropdownTransition(isOpen) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    setIsRendered(true);

    let outerFrame = 0;
    let innerFrame = 0;

    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [isOpen]);

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== "opacity" || isOpen) return;
    setIsRendered(false);
  };

  return { isRendered, isVisible, handleTransitionEnd };
}
