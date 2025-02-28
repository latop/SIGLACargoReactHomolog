import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Params {
  children: React.ReactNode;
}

export const queryClient = new QueryClient();

const QueryProvider = ({ children }: Params) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
