import { getDashboardService } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useOverviewStats = () => {
    return useQuery({
        queryKey: ["overviewStats"],
        queryFn: () => getDashboardService.getOverviewStats(),
        staleTime: 0,
    });
};

export const useChartStats = () => {
    return useQuery({
        queryKey: ["chartStats"],
        queryFn: () => getDashboardService.getChartStats(),
        staleTime: 0,
    });
};

export const useRecentStats = () => {
    return useQuery({
        queryKey: ["recentStats"],
        queryFn: () => getDashboardService.getRecentStats(),
        staleTime: 0,
    });
};