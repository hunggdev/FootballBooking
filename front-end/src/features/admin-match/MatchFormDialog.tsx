import { useState } from "react";
import { AlertCircle, Swords, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field as FieldWrapper,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import type {
  Match,
  CreateMatchPayload,
  UpdateMatchPayload,
} from "@/types/match";

interface MatchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Match | null;
  onSubmit: (data: CreateMatchPayload | UpdateMatchPayload) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

interface MatchFormState {
  userId: number;
  fullName: string;
  minAge: number;
  maxAge: number;
  fieldType: "FIVE" | "SEVEN" | "ELEVEN";
  timeNote: string;
  description: string;
  costRule: "SPLIT" | "LOSER_PAYS" | "WINNER_PAYS" | "NEGOTIATE";
  status: "OPEN" | "MATCHED" | "CANCELLED" | "FINISHED";
}

const emptyForm: MatchFormState = {
  userId: 0,
  fullName: "",
  minAge: 18,
  maxAge: 40,
  fieldType: "FIVE",
  timeNote: "",
  description: "",
  costRule: "SPLIT",
  status: "OPEN",
};

function getInitialFormState(initialData?: Match | null): MatchFormState {
  if (initialData) {
    return {
      userId: Number(initialData.user?.userId ?? 0),
      fullName: initialData.user?.fullName ?? "",
      minAge: initialData.minAge ?? 18,
      maxAge: initialData.maxAge ?? 40,
      fieldType:
        (initialData.fieldType?.toUpperCase() as MatchFormState["fieldType"]) ||
        "FIVE",
      timeNote: initialData.timeNote ?? "",
      description: initialData.description ?? "",
      costRule:
        (initialData.costRule?.toUpperCase() as MatchFormState["costRule"]) ||
        "SPLIT",
      status:
        (initialData.status?.toUpperCase() as MatchFormState["status"]) ||
        "OPEN",
    };
  }
  return emptyForm;
}

export function MatchFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: MatchFormDialogProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<MatchFormState>(() =>
    getInitialFormState(initialData),
  );
  const [error, setError] = useState<string | null>(null);

  const updateMatch = <K extends keyof MatchFormState>(
    key: K,
    value: MatchFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (error) setError(null);
  };

  const validate = () => {
    if (!form.timeNote.trim()) {
      return "Vui lòng nhập thời gian dự kiến tổ chức trận đấu.";
    }
    if (form.minAge < 0 || form.maxAge < 0) {
      return "Độ tuổi không thể là số âm.";
    }
    if (form.minAge > form.maxAge) {
      return "Tuổi tối thiểu không thể lớn hơn tuổi tối đa.";
    }
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    const payload: CreateMatchPayload | UpdateMatchPayload = {
      minAge: Number(form.minAge),
      maxAge: Number(form.maxAge),
      fieldType: form.fieldType,
      timeNote: form.timeNote,
      description: form.description,
      costRule: form.costRule,
      ...(isEditing ? { status: form.status } : {}),
    };

    onSubmit(payload);
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-border bg-surface text-text-primary">
        {/* Header Section */}
        <div className="bg-elevated/80 p-6 border-b border-border">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
                  {isEditing
                    ? `Sửa thông tin kèo đấu #${initialData?.matchId}`
                    : "Tạo kèo đấu mới"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {isEditing
                    ? "Cập nhật các tiêu chí và trạng thái của trận giao hữu"
                    : "Đăng tin tìm đối giao lưu bóng đá"}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {(error || serverError) && (
            <div className="flex items-center gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger-bg p-3.5 text-xs font-medium text-status-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error ?? serverError}</span>
            </div>
          )}

          <FieldGroup className="space-y-4">
            {isEditing && (
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Chủ kèo
                </FieldLabel>
                <Input
                  value={form.fullName || "Người dùng ẩn danh"}
                  readOnly
                  className="border-border bg-elevated/60 text-text-muted disabled:opacity-70 disabled:cursor-not-allowed "
                />
              </FieldWrapper>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Loại quy mô sân <span className="text-status-danger">*</span>
                </FieldLabel>
                <Select
                  value={form.fieldType}
                  onValueChange={(value) =>
                    updateMatch(
                      "fieldType",
                      (value ?? "FIVE") as MatchFormState["fieldType"],
                    )
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue>
                      {form.fieldType === "FIVE"
                        ? "Sân 5"
                        : form.fieldType === "SEVEN"
                          ? "Sân 7"
                          : "Sân 11"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="FIVE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Sân 5 người (5 vs 5)
                    </SelectItem>
                    <SelectItem
                      value="SEVEN"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Sân 7 người (7 vs 7)
                    </SelectItem>
                    <SelectItem
                      value="ELEVEN"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Sân 11 người (11 vs 11)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Hình thức trả tiền{" "}
                  <span className="text-status-danger">*</span>
                </FieldLabel>
                <Select
                  value={form.costRule}
                  onValueChange={(value) =>
                    updateMatch(
                      "costRule",
                      (value ?? "SPLIT") as MatchFormState["costRule"],
                    )
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue>
                      {form.costRule === "SPLIT"
                        ? "Chia đều tiền sân (50/50)"
                        : form.costRule === "LOSER_PAYS"
                          ? "Thua trả toàn bộ"
                          : form.costRule === "WINNER_PAYS"
                            ? "Thắng trả toàn bộ"
                            : "Thương lượng"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="SPLIT"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Chia đều tiền sân (50/50)
                    </SelectItem>
                    <SelectItem
                      value="LOSER_PAYS"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Thua trả toàn bộ (100%)
                    </SelectItem>
                    <SelectItem
                      value="WINNER_PAYS"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Thắng trả toàn bộ (100%)
                    </SelectItem>
                    <SelectItem
                      value="NEGOTIATE"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Thương lượng khi gặp
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Tuổi tối thiểu (min)
                </FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={form.minAge}
                  onChange={(e) =>
                    updateMatch("minAge", Number(e.target.value))
                  }
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Tuổi tối đa (max)
                </FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={form.maxAge}
                  onChange={(e) =>
                    updateMatch("maxAge", Number(e.target.value))
                  }
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>
            </div>

            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Thời gian dự kiến thi đấu{" "}
                <span className="text-status-danger">*</span>
              </FieldLabel>
              <Input
                value={form.timeNote}
                onChange={(e) => updateMatch("timeNote", e.target.value)}
                placeholder="VD: 19:00 - 20:30 Thứ 7 tuần này"
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mô tả / Yêu cầu thêm
              </FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => updateMatch("description", e.target.value)}
                placeholder="VD: Tìm đối giao lưu vui vẻ, văn minh..."
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted min-h-[75px] focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {isEditing && (
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Trạng thái kèo đấu
                </FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateMatch(
                      "status",
                      (value ?? "OPEN") as MatchFormState["status"],
                    )
                  }
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem
                      value="OPEN"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đang tìm đối (Mở)
                    </SelectItem>
                    <SelectItem
                      value="MATCHED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã ghép đối
                    </SelectItem>
                    <SelectItem
                      value="FINISHED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã kết thúc
                    </SelectItem>
                    <SelectItem
                      value="CANCELLED"
                      className="text-text-secondary focus:text-text-primary"
                    >
                      Đã hủy kèo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          </FieldGroup>
        </div>

        {/* Footer Actions */}
        <Separator className="bg-border" />
        <div className="flex items-center justify-end gap-3 p-4 bg-elevated/40">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer px-5"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold px-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </span>
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Tạo kèo đấu"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
