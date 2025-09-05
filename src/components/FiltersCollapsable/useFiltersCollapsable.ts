import { useState, useEffect } from "react";

export function useFiltersCollapse(storageKey: string) {
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setShowMoreFilters(JSON.parse(stored));
    }
  }, [storageKey]);

  const toggleMoreFilters = () => {
    setShowMoreFilters((prev) => {
      localStorage.setItem(storageKey, JSON.stringify(!prev));
      return !prev;
    });
  };

  return {
    showMoreFilters,
    toggleMoreFilters,
  };
}
