import { useEffect, useRef } from "react";
import { useDropdownTransition } from "./use-dropdown-transition";

export function useDropdownBehavior(isOpen, setIsOpen) {
  const wrapRef = useRef(null);
  const { isRendered, isVisible, handleTransitionEnd } =
    useDropdownTransition(isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleBlur = (event) => {
    if (!wrapRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    if (wrapRef.current?.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  };

  const wrapProps = {
    ref: wrapRef,
    onBlur: handleBlur,
    onMouseLeave: handleMouseLeave,
  };

  return { wrapProps, isRendered, isVisible, handleTransitionEnd };
}
