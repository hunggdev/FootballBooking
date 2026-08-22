// src/features/admin-match/ManageMatch.tsx
import { PageHeader } from "@/layouts/admin/PageHeader";
import { MatchStatsCards } from "./MatchStatsCards";
import { MatchFilterBar } from "./MatchFilterBar";
import { MatchesTable } from "./MatchesTable";
import {
  useMatches,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
  useStatsMatch,
} from "@/stores/useMatchStore";
import type { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { MatchDetailDialog } from "./MatchDetailDialog";
import { MatchFormDialog } from "./MatchFormDialog";

import type {
  Match,
  CreateMatchPayload,
  UpdateMatchPayload,
  Stats,
} from "@/types/match";

interface ErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

const PAGE_SIZE = 10;

export function ManageMatch() {
  const { data, isLoading, error } = useMatches();
  const createMatch = useCreateMatch();
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();
  const { data: statsData } = useStatsMatch();

  const matches: Match[] = data?.matches ?? [];
  const stats: Stats = statsData ?? {
    matches: 0,
    totalMatchInThisMonth: 0,
    matchOpen: 0,
    matchMatched: 0,
    matchFinished: 0,
    matchCancelled: 0,
  };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [detailMatchId, setDetailMatchId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchSearch =
        (match.user?.fullName || "")
          .toLowerCase()
          .includes(search.trim().toLowerCase()) ||
        (match.timeNote || "")
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchStatus =
        status === "all" ||
        (match.status || "").toLowerCase() === status.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [matches, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / PAGE_SIZE));

  const handleAdd = () => {
    setEditingMatch(null);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleView = (match: Match) => {
    setDetailMatchId(match.matchId);
    setDetailOpen(true);
  };

  const handleDelete = (match: Match) => {
    const ok = confirm(
      `Bạn có chắc muốn xóa kèo đấu #${match.matchId} của "${match.user?.fullName || "Người dùng"}"?`,
    );
    if (!ok) return;

    setListError(null);
    deleteMatch.mutate(match.matchId, {
      onError(error) {
        setListError(getErrorMessage(error, "Xóa kèo đấu thất bại."));
      },
    });
  };

  const handleSubmit = (values: CreateMatchPayload | UpdateMatchPayload) => {
    setFormError(null);

    if (editingMatch) {
      updateMatch.mutate(
        {
          matchId: editingMatch.matchId,
          payload: values as UpdateMatchPayload,
        },
        {
          onSuccess() {
            setDialogOpen(false);
            setEditingMatch(null);
          },
          onError(error) {
            setFormError(getErrorMessage(error, "Cập nhật kèo đấu thất bại."));
          },
        },
      );
      return;
    }

    createMatch.mutate(values as CreateMatchPayload, {
      onSuccess() {
        setDialogOpen(false);
      },
      onError(error) {
        setFormError(getErrorMessage(error, "Tạo kèo đấu thất bại."));
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-text-secondary">
        Đang tải danh sách kèo đấu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-status-danger">
        Không thể tải danh sách kèo đấu.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý kèo đấu"
        subtitle="Quản lý danh sách kèo đấu và đối thủ giao lưu trên hệ thống"
      />

      <MatchStatsCards
        matches={stats?.matches ?? 0}
        totalMatchInThisMonth={stats?.totalMatchInThisMonth ?? 0}
        open={stats?.matchOpen ?? 0}
        matched={stats?.matchMatched ?? 0}
        finished={stats?.matchFinished ?? 0}
        cancelled={stats?.matchCancelled ?? 0}
      />

      <MatchFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onClick={handleAdd}
        onChangePage={setCurrentPage}
      />

      {listError && (
        <p className="mt-2 text-sm text-status-danger">{listError}</p>
      )}

      <MatchesTable
        matches={filteredMatches}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredMatches.length}
        pageSize={PAGE_SIZE}
      />

      <MatchDetailDialog
        matchId={detailMatchId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <MatchFormDialog
        key={editingMatch?.matchId ?? "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingMatch}
        onSubmit={handleSubmit}
        isSubmitting={createMatch.isPending || updateMatch.isPending}
        serverError={formError}
      />
    </>
  );
}
