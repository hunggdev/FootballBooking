import api from "@/lib/axios";
import type { CreateMatchPayload, UpdateMatchPayload } from "@/types/match";


export const matchService = {
    getAllMatches: async(all = true) => {
        try {
            const res = await api.get("/matches", {params: all ? {all : "1"}: undefined, withCredentials: true});
            return res.data;
        } catch (error) {
            throw error; 
        }
    },

    getMatchById: async (matchId: number) => {
        try {
            const res = await api.get(`/matches/${matchId}`, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    createMatch: async (payload: CreateMatchPayload) => {
        try{
            const res = await api.post("/matches", payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    updateMatch: async (matchId: number, payload: UpdateMatchPayload) => {
        try {
            const res = await api.put(`/matches/${matchId}`, payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMatch: async (matchId: number) => {
        try {
            const res = await api.delete(`/matches/${matchId}`, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    statsMatch: async () => {
        try {
            const res = await api.get("/matches/stats", { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    joinMatch: async (matchId: number) => {
        try {
            const res = await api.post(`/matches/${matchId}/join`, {}, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    cancelJoinMatch: async (matchId: number) => {
        try {
            const res = await api.delete(`/matches/${matchId}/join`, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },



};
