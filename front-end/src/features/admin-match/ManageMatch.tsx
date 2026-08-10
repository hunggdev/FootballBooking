// src/components/admin/customers/CustomersPage.tsx
import { PageHeader } from "@/layouts/admin/PageHeader";
import { MatchStatsCards } from "./MatchStatsCards";
import { MatchFilterBar } from "./MatchFilterBar";
import { MatchesTable } from "./MatchesTable";
import { useMatches, useCreateMatch, useUpdateMatch, useDeleteMatch, useStatsMatch } from "@/stores/useMatchStore";
import type { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { MatchDetailDialog } from "./MatchDetailDialog";
import { MatchFormDialog } from "./MatchFormDialog";



import type {
  Match,
  CreateMatchPayload,
  UpdateMatchPayload,
  Stats
} from "@/types/match";

interface ErrorResponse {
  message?: string;
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const axiosError = error as AxiosError<ErrorResponse>;

  return axiosError.response?.data?.message ?? fallback;
}

const PAGE_SIZE = 5;

export function ManageMatch() {
  const {data, isLoading, error} = useMatches();
  const createMatch = useCreateMatch();
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();
  const {data:statsData} = useStatsMatch();  
  
  const matches: Match[] = data?.matches ?? [];
  const stats: Stats = statsData?? {};
  console.log(stats);
  
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
            match.user.fullName.toLowerCase().includes(search.toLowerCase())
    
            const matchStatus =
            status === "all" ||
            match.status.toLowerCase() === status.toLowerCase();
            
            return matchSearch && matchStatus;
            
          });
        }, [matches, search, status]);
        
    const totalPages = Math.max(1, Math.ceil(filteredMatches.length / PAGE_SIZE));

    const handleAdd = () => {
      setEditingMatch(null);
      setFormError(null);
      setDialogOpen(true);
    }

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
        `Bạn có chắc muốn ngừng hoạt động tài khoản này "${match.matchId}"?`
      );
      if (!ok) return;
      setListError(null);
      deleteMatch.mutate(match.matchId, {
        onError(error) {
          setListError(
            getErrorMessage(
              error,
              "Xóa tài khoản thất bại."
            )
          );
        },
      });
    };

    const handleSubmit = (
      values:
        | CreateMatchPayload
        | UpdateMatchPayload
    ) => {

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
              setFormError(
                getErrorMessage(
                  error,
                  "Cập nhật sân thất bại."
                )
              );
            },
          }
        );
        return;
      }
      createMatch.mutate(
        values as CreateMatchPayload,
        {
          onSuccess() {
            setDialogOpen(false);
          },
          onError(error) {
            setFormError(
              getErrorMessage(
                error,
                "Tạo khách hàng thất bại."
              )
            );
          },
        }
      );
    };

    if (isLoading)
          return <div>Loading...</div>;
    if (error)
          return <div>Có lỗi xảy ra.</div>;

  return (
    <>
      <PageHeader
        title="Quản lý kèo đấu"
        subtitle="Danh sách kèo đấu đã tạo trên hệ thống"
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
        <p className="mt-4 text-sm text-red-500">
          {listError}
        </p>
      )}
      <MatchesTable matches={filteredMatches} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} currentPage={currentPage} pageSize={PAGE_SIZE}/>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}  />
      
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
