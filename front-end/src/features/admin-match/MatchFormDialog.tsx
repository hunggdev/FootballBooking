import { useState } from "react";
import { AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      fieldType: (initialData.fieldType as MatchFormState["fieldType"]) || "FIVE",
      timeNote: initialData.timeNote ?? "",
      description: initialData.description ?? "",
      costRule: (initialData.costRule as MatchFormState["costRule"]) || "SPLIT",
      status: (initialData.status as MatchFormState["status"]) || "OPEN",
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
    getInitialFormState(initialData)
  );
  const [error, setError] = useState<string | null>(null);

  const updateMatch = <K extends keyof MatchFormState>(
    key: K,
    value: MatchFormState[K]
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
      return "Tuổi tối thiểu (min) không thể lớn hơn tuổi tối đa (max).";
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
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto border-border bg-elevated text-text-primary ring-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-text-primary">
            {isEditing ? "Sửa thông tin kèo đấu" : "Tạo kèo đấu mới"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4 pt-2">
          {(error || serverError) && (
            <div className="flex items-center gap-2 rounded-md border border-status-danger/30 bg-status-danger-bg p-3 text-xs font-medium text-status-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error ?? serverError}</span>
            </div>
          )}

          {isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold text-text-muted">
                Người tạo kèo
              </FieldLabel>
              <Input
                value={form.fullName || "Người dùng ẩn danh"}
                disabled
                className="cursor-not-allowed border-border bg-surface text-text-muted"
              />
            </FieldWrapper>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold text-text-muted">
                Loại sân
              </FieldLabel>
              <Select
                value={form.fieldType}
                onValueChange={(value) =>
                  updateMatch(
                    "fieldType",
                    (value ?? "FIVE") as MatchFormState["fieldType"]
                  )
                }
              >
                <SelectTrigger className="border-border bg-surface text-text-primary">
                  <SelectValue placeholder="Chọn loại sân" />
                </SelectTrigger>
                <SelectContent className="border-border bg-elevated text-text-primary">
                  <SelectItem value="FIVE">Sân 5 người (5-5)</SelectItem>
                  <SelectItem value="SEVEN">Sân 7 người (7-7)</SelectItem>
                  <SelectItem value="ELEVEN">Sân 11 người (11-11)</SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold text-text-muted">
                Hình thức trả tiền
              </FieldLabel>
              <Select
                value={form.costRule}
                onValueChange={(value) =>
                  updateMatch(
                    "costRule",
                    (value ?? "SPLIT") as MatchFormState["costRule"]
                  )
                }
              >
                <SelectTrigger className="border-border bg-surface text-text-primary">
                  <SelectValue placeholder="Chọn hình thức trả tiền" />
                </SelectTrigger>
                <SelectContent className="border-border bg-elevated text-text-primary">
                  <SelectItem value="SPLIT">Chia đều (50/50)</SelectItem>
                  <SelectItem value="LOSER_PAYS">Thua trả 100%</SelectItem>
                  <SelectItem value="WINNER_PAYS">Thắng trả 100%</SelectItem>
                  <SelectItem value="NEGOTIATE">Thương lượng</SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold text-text-muted">
                Tuổi tối thiểu (min)
              </FieldLabel>
              <Input
                type="number"
                min={0}
                value={form.minAge}
                onChange={(e) => updateMatch("minAge", Number(e.target.value))}
                className="border-border bg-surface text-text-primary"
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold text-text-muted">
                Tuổi tối đa (max)
              </FieldLabel>
              <Input
                type="number"
                min={0}
                value={form.maxAge}
                onChange={(e) => updateMatch("maxAge", Number(e.target.value))}
                className="border-border bg-surface text-text-primary"
              />
            </FieldWrapper>
          </div>

          <FieldWrapper>
            <FieldLabel className="text-xs font-semibold text-text-muted">
              Thời gian dự kiến
            </FieldLabel>
            <Input
              value={form.timeNote}
              onChange={(e) => updateMatch("timeNote", e.target.value)}
              placeholder="VD: 19:00 - 20:30 Thứ 7 tuần này"
              className="border-border bg-surface text-text-primary placeholder:text-text-muted"
            />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel className="text-xs font-semibold text-text-muted">
              Mô tả / Yêu cầu thêm
            </FieldLabel>
            <Input
              value={form.description}
              onChange={(e) => updateMatch("description", e.target.value)}
              placeholder="VD: Tìm đối giao lưu vui vẻ, không quạu..."
              className="border-border bg-surface text-text-primary placeholder:text-text-muted"
            />
          </FieldWrapper>

          {isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold text-text-muted">
                Trạng thái kèo đấu
              </FieldLabel>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  updateMatch(
                    "status",
                    (value ?? "OPEN") as MatchFormState["status"]
                  )
                }
              >
                <SelectTrigger className="border-border bg-surface text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-elevated text-text-primary">
                  <SelectItem value="OPEN">Đang tìm đối (Mở)</SelectItem>
                  <SelectItem value="MATCHED">Đã ghép đối</SelectItem>
                  <SelectItem value="FINISHED">Đã hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}
        </FieldGroup>

        <DialogFooter className="mt-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-border bg-surface text-text-primary hover:bg-surface-hover"
          >
            Hủy
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="border-transparent bg-brand-primary font-semibold text-white hover:bg-brand-primary-hover"
          >
            {isSubmitting
              ? "Đang lưu..."
              : isEditing
              ? "Lưu thay đổi"
              : "Tạo kèo đấu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}