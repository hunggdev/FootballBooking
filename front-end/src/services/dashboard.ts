import api from "@/lib/api";

export const getDashboardService = {
  
    getOverviewStats: async () => {
        const res = await api.get("/dashboard/overview");
        return res.data.data.overview
    },

    getChartStats: async () => {
        const res = await api.get("/dashboard/chart");
        return res.data.data
    },

    getRecentStats: async () => {
        const res = await api.get("/dashboard/recent");
        return res.data.data
    },

};

 