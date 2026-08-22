import { useState } from "react";
import { Swords, AlertCircle, Loader2 } from "lucide-react";
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

type MatchStatus =
  | "OPEN"
  | "MATCHED"
  | "CANCELLED"
  | "FINISHED";

type CostRule =
  | "SPLIT"
  | "LOSER_PAYS"
  | "WINNER_PAYS"
  | "NEGOTIATE";

interface FormState {
  userId?: number;
  fullName: string;
  minAge: number;
  maxAge: number;
  fieldType: string;
  timeNote: string;
  description: string;
  costRule: CostRule;
  status: MatchStatus;
}

const emptyForm: FormState = {
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

export function MatchFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  serverError,
}: MatchFormDialogProps) {
  const isEditing = !!initialData;

  const getDefaultForm = (): FormState => {
    if (!initialData) {
      return emptyForm;
    }

    return {
      fullName: initialData.user?.fullName ?? "",
      minAge: initialData.minAge ?? 18,
      maxAge: initialData.maxAge ?? 40,
      fieldType: initialData.fieldType ?? "FIVE",
      timeNote: initialData.timeNote ?? "",
      description: initialData.description ?? "",
      costRule: (initialData.costRule as CostRule) ?? "SPLIT",
      status: (initialData.status as MatchStatus) ?? "OPEN",
    };
  };

  const [form, setForm] = useState<FormState>(getDefaultForm());
  const [error, setError] = useState<string | null>(null);

  const updateMatch = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (error) setError(null);
  };

  const validate = (): string | null => {
    if (form.minAge < 0 || form.maxAge < 0) {
      return "Tuổi không được nhỏ hơn 0.";
    }

    if (form.minAge > form.maxAge) {
      return "Tuổi tối thiểu không được lớn hơn tuổi tối đa.";
    }

    if (!form.fieldType) {
      return "Vui lòng chọn loại sân.";
    }

    if (!form.timeNote.trim()) {
      return "Vui lòng nhập thời gian dự kiến.";
    }

    if (!form.description.trim()) {
      return "Vui lòng nhập mô tả.";
    }

    if (!form.costRule) {
      return "Vui lòng chọn hình thức trả tiền.";
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
      fieldType: form.fieldType as "FIVE" | "SEVEN" | "ELEVEN",
      timeNote: form.timeNote.trim(),
      description: form.description.trim(),
      costRule: form.costRule,
      ...(isEditing ? { status: form.status } : {}),
    };

    onSubmit(payload);
  };

  const resetForm = () => {
    setForm(getDefaultForm());
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
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
                  {isEditing ? "Sửa thông tin kèo đấu" : "Tạo kèo tìm đối mới"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  {isEditing
                    ? "Cập nhật yêu cầu và thông tin giao lưu bóng đá"
                    : "Đăng bài tìm đối tác thi đấu bóng đá nhanh chóng"}
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
            {/* Quy mô sân & Thể thức chia tiền */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Loại quy mô sân <span className="text-status-danger">*</span>
                </FieldLabel>
                <Select
                  value={form.fieldType}
                  onValueChange={(value) => updateMatch("fieldType", value ?? "FIVE")}
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue placeholder="Chọn loại sân" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem value="FIVE" className="text-text-secondary focus:text-text-primary">
                      Sân 5 người (5 vs 5)
                    </SelectItem>
                    <SelectItem value="SEVEN" className="text-text-secondary focus:text-text-primary">
                      Sân 7 người (7 vs 7)
                    </SelectItem>
                    <SelectItem value="ELEVEN" className="text-text-secondary focus:text-text-primary">
                      Sân 11 người (11 vs 11)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Hình thức trả tiền <span className="text-status-danger">*</span>
                </FieldLabel>
                <Select
                  value={form.costRule}
                  onValueChange={(value) => updateMatch("costRule", value as CostRule)}
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem value="SPLIT" className="text-text-secondary focus:text-text-primary">
                      Chia đều tiền sân (50/50)
                    </SelectItem>
                    <SelectItem value="LOSER_PAYS" className="text-text-secondary focus:text-text-primary">
                      Thua trả 100%
                    </SelectItem>
                    <SelectItem value="WINNER_PAYS" className="text-text-secondary focus:text-text-primary">
                      Thắng trả 100%
                    </SelectItem>
                    <SelectItem value="NEGOTIATE" className="text-text-secondary focus:text-text-primary">
                      Thương lượng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            </div>

            {/* Độ tuổi min - max */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Tuổi tối thiểu (min)
                </FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={form.minAge}
                  onChange={(e) => updateMatch("minAge", Number(e.target.value))}
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
                  onChange={(e) => updateMatch("maxAge", Number(e.target.value))}
                  className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
                />
              </FieldWrapper>
            </div>

            {/* Thời gian dự kiến */}
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Thời gian dự kiến <span className="text-status-danger">*</span>
              </FieldLabel>
              <Input
                value={form.timeNote}
                onChange={(e) => updateMatch("timeNote", e.target.value)}
                placeholder="VD: 18:00 - 19:30 Thứ Bảy ngày 22/07"
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {/* Mô tả */}
            <FieldWrapper>
              <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mô tả chi tiết & Lời nhắn <span className="text-status-danger">*</span>
              </FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => updateMatch("description", e.target.value)}
                placeholder="Nhập mô tả trình độ, tinh thần giao lưu, yêu cầu cụ thể..."
                className="border-border bg-elevated/60 text-text-primary placeholder:text-text-muted min-h-[75px] focus-visible:border-brand-primary focus-visible:ring-brand-primary/20"
              />
            </FieldWrapper>

            {/* Trạng thái khi chỉnh sửa */}
            {isEditing && (
              <FieldWrapper>
                <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Trạng thái kèo đấu
                </FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(value) => updateMatch("status", value as MatchStatus)}
                >
                  <SelectTrigger className="border-border bg-elevated/60 text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-elevated text-text-primary">
                    <SelectItem value="OPEN" className="text-text-secondary focus:text-text-primary">
                      Đang mở tìm đối
                    </SelectItem>
                    <SelectItem value="MATCHED" className="text-text-secondary focus:text-text-primary">
                      Đã ghép đối
                    </SelectItem>
                    <SelectItem value="FINISHED" className="text-text-secondary focus:text-text-primary">
                      Đã kết thúc
                    </SelectItem>
                    <SelectItem value="CANCELLED" className="text-text-secondary focus:text-text-primary">
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
              "Đăng tin tìm đối"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}