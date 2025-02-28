import React from "react";

export const useHash = (): [string, (newHash: string) => string] => {
  const [hash, setHash] = React.useState<string>(
    typeof window !== "undefined" ? window.location.hash : "",
  );

  const hashChangeHandler = () => {
    setHash(window.location.hash);
  };

  React.useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => window.removeEventListener("hashchange", hashChangeHandler);
  }, []);

  const updateHash = (newHash: string): string => {
    if (newHash !== hash) window.location.hash = newHash;
    return newHash;
  };

  return [hash, updateHash];
};
