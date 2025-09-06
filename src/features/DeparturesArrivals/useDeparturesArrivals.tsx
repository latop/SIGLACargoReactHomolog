"use client";

import { useState } from "react";
import { useDeparturesArrivals as useBaseDeparturesArrivals } from "@/hooks/useDeparturesArrivals/useDeparturesArrivals";

interface UseDeparturesArrivalsProps {
  revalidateOnMount?: boolean;
  refreshInterval?: number;
}

export function useDeparturesArrivals({
  revalidateOnMount = false,
  refreshInterval,
}: UseDeparturesArrivalsProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    departuresArrivals,
    error: isError,
    isEmpty,
    isLoading,
    showContent,
  } = useBaseDeparturesArrivals({
    revalidateOnMount,
    refreshInterval,
  });

  const loadMore = async (page: number) => {
    setIsLoadingMore(true);
    setCurrentPage(page);
    setIsLoadingMore(false);
  };

  const hasData = !!departuresArrivals?.length;
  const totalCount = departuresArrivals?.length || 0;

  return {
    departuresArrivals,
    isLoading,
    isError,
    showContent,
    isEmpty,
    hasData,
    currentPage,
    loadMore,
    isLoadingMore,
    totalCount,
  };
}
