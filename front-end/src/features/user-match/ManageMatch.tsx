import { useMemo, useState } from "react";
import { PageIntro } from "./PageIntro";
import { MatchToolbar } from "./MatchToolbar";
import { MatchesTable } from "./MatchTable";
import { Pagination } from "@/components/common/Pagination";
import { useMatches, useCreateMatch, useUpdateMatch, useDeleteMatch, useJoinMatch, useCancelJoinMatch } from "@/stores/useMatchStore";
import { JoinMatchDialog } from "./JoinMatchDialog";
import { MatchFormDialog } from "./MatchFormDialog";

import type {
  Match,
  CreateMatchPayload,
  UpdateMatchPayload
} from "@/types/match";
import type { AxiosError } from "axios";
import { MatchDetailDialog } from "./MatchDetailDialog";

const PAGE_SIZE = 10;

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


export default function ManageMatch() {
  const { data, isLoading, error } = useMatches();

  const createMatch = useCreateMatch();
  const updateMatch = useUpdateMatch();
  const deleteMatch = useDeleteMatch();
  const joinMatch = useJoinMatch();
  const cancelMatch = useCancelJoinMatch();


  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogJoinOpen, setDialogJoinOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [detailMatchId, setDetailMatchId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formJoinError, setFormJoinError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [filter, setFilter] = useState("OPEN");
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const matches: Match[] = data?.matches ?? [];

  const filteredMatches = useMemo(() => {
    const keyword = search.toLowerCase();

    return matches.filter((match) => {
      const matchSearch = match.user.fullName
        .toLowerCase()
        .includes(keyword);

      switch (filter) {
        case "OPEN":
          return matchSearch && match.status === "OPEN";

        case "MINE":
          return matchSearch && match.isMine;

        case "JOINED":
          return matchSearch && match.isJoined;

        case "FINISHED":
          return matchSearch && match.status === "FINISHED";

        default:
          return matchSearch;
      }
    });
  }, [filter, matches, search]);
  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / PAGE_SIZE));

  const handleClickJoin = (matchId: number) => {
    setSelectedMatchId(matchId);
    setDialogJoinOpen(true);
  };

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

  const handleCancel = (match: Match) => {
    const ok = confirm(
      `Bạn có chắc muốn hủy tham gia kèo đấu này "${match.matchId}"?`
    );
    if (!ok) return;
    setListError(null);
    cancelMatch.mutate(match.matchId, {
      onError(error) {
        setListError(
          getErrorMessage(
            error,
            "Hủy tham gia kèo thất bại."
          )
        );
      },
    });
  };

  const handleJoinSubmit = () => {
    if (!selectedMatchId) {
      setFormJoinError("Không tìm thấy trận đấu.");
      return;
    }

    setFormJoinError(null);

    joinMatch.mutate(selectedMatchId, {
      onSuccess() {
        setDialogJoinOpen(false);
        setSelectedMatchId(null);
      },

      onError(error) {
        setFormJoinError(
          getErrorMessage(error, "Tham gia kèo thất bại.")
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

    <div className="space-y-6 w-full">
      <PageIntro />

      <div className="grid grid-cols-1 gap-6 ">
        {/* Cột nội dung chính */}
        <div className="space-y-4">
          <MatchToolbar
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            onClick={handleAdd}
            onChangePage={setCurrentPage}
          />
          {listError && (
            <p className="mt-4 text-sm text-status-danger">
              {listError}
            </p>
          )}

          <MatchesTable
            matches={filteredMatches}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            filter={filter}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleClickJoin}
            onCancel={handleCancel}
          />
          <MatchDetailDialog
            open={detailOpen}
            onOpenChange={setDetailOpen}
            matchId={detailMatchId}
          />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredMatches.length} pageSize={PAGE_SIZE} />
          <JoinMatchDialog
            open={dialogJoinOpen}
            onOpenChange={setDialogJoinOpen}
            onSubmit={handleJoinSubmit}
            serverError={formJoinError}
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
        </div>

        {/* Cột sidebar bên phải */}
        {/* <Sidebar tournaments={mockTournaments} guideItems={guideItems} /> */}
      </div>
    </div>
  );
}
