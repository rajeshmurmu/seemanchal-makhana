import {
  fetchDashboardMetrics,
  fetchSalesTrend,
  fetchTopProducts,
} from "@/lib/client/dashboard-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export interface TopProduct {
  name: string;
  sales: number;
}

export interface SalesData {
  MetricCardPropsmonth: string;
  sales: number;
  orders: number;
}

export interface IDashboardMetrics {
  revenue: number; // converting paise to rupees
  orders: number;
  users: number;
  products: number;
}

export default function useDashboardData() {
  const [topProductMetrics, setProductsMetrics] = useState<TopProduct[]>([]);
  const [salesDataMetrics, setSalesDataMetrics] = useState<SalesData[]>([]);
  const [metrics, setMetrics] = useState<IDashboardMetrics | null>(null);
  const [loadingDashboardData, setLoadingDashboardData] =
    useState<boolean>(true);

  // UseQuery to fetch metrics
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
    isError: metricsIsError,
    refetch: metricsRefetch,
  } = useQuery({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: () => fetchDashboardMetrics(),
  });

  // UseEffect to handle metrics fetching results
  useEffect(() => {
    if (metricsData) {
      setMetrics(metricsData.metrics || []);
    }
  }, [metricsData]);

  useEffect(() => {
    if (metricsError || metricsIsError) {
      metricsRefetch();
      setMetrics(null);
    }
  }, [metricsError, metricsIsError, metricsRefetch]);

  // UseQuery to fetch sales trend
  const {
    data: salesTrendData,
    isLoading: salesTrendLoading,
    error: salesTrendError,
    isError: salesTrendIsError,
    refetch: salesTrendRefetch,
  } = useQuery({
    queryKey: ["sales-trend"],
    queryFn: () => fetchSalesTrend(),
  });

  // UseEffects to handle sales trend fetching results
  useEffect(() => {
    if (salesTrendData) {
      setSalesDataMetrics(salesTrendData.salesData || []);
    }
  }, [salesTrendData]);

  useEffect(() => {
    if (salesTrendError || salesTrendIsError) {
      salesTrendRefetch();
      setSalesDataMetrics([]);
    }
  }, [salesTrendError, salesTrendIsError, salesTrendRefetch]);

  // UseQuery to fetch top products
  const {
    data: topProductsData,
    isLoading: topProductsLoading,
    error: topProductsError,
    isError: topProductsIsError,
    refetch: topProductsRefetch,
  } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => fetchTopProducts(),
  });

  // UseEffects to handle top products fetching results
  useEffect(() => {
    if (topProductsData) {
      setProductsMetrics(topProductsData.topProducts || []);
    }
  }, [topProductsData]);

  useEffect(() => {
    if (topProductsError || topProductsIsError) {
      topProductsRefetch();
      setProductsMetrics([]);
    }
  }, [topProductsError, topProductsIsError, topProductsRefetch]);

  useEffect(() => {
    if (
      salesTrendData &&
      topProductsData &&
      metricsData &&
      !salesTrendLoading &&
      !topProductsLoading &&
      !metricsLoading
    ) {
      setLoadingDashboardData(false);
    }
  }, [
    salesTrendData,
    topProductsData,
    metricsData,
    salesTrendLoading,
    topProductsLoading,
    metricsLoading,
  ]);

  return {
    topProductMetrics,
    salesDataMetrics,
    metrics,
    salesTrendLoading,
    topProductsLoading,
    metricsLoading,
    loadingDashboardData,
    setLoadingDashboardData,
  };
}
