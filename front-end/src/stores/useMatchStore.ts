import { matchService } from "@/services/matchService";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateMatchPayload, UpdateMatchPayload } from "@/types/match";

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: () => matchService.getAllMatches(true),
    staleTime: 0,
  });
};

export const useMatch = (matchId: number) => {
    return useQuery({
        queryKey: ["matches", matchId], 
        queryFn: () => matchService.getMatchById(matchId),
        enabled: !!matchId,
        retry: false
    });
};

export const useCreateMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateMatchPayload) => matchService.createMatch(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
    });
};

export const useUpdateMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ matchId, payload }: { matchId: number; payload: UpdateMatchPayload }) =>
            matchService.updateMatch(matchId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
    });
};

export const useDeleteMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (matchId: number) => matchService.deleteMatch(matchId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
    });
};

export const useStatsMatch = () => {
    return useQuery({
        queryKey: ["matches", "stats"],
        queryFn: () => matchService.statsMatch(),
    });
}

export const useJoinMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (matchId: number) => matchService.joinMatch(matchId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
    });
}

export const useCancelJoinMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (matchId: number) => matchService.cancelJoinMatch(matchId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
    });
}
