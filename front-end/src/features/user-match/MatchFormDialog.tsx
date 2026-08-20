import { useState } from "react";
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
  minAge: 0,
  maxAge: 0,
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
      minAge: initialData.minAge,
      maxAge: initialData.maxAge,
      fieldType: initialData.fieldType,
      timeNote: initialData.timeNote ?? "",
      description: initialData.description ?? "",
      costRule: initialData.costRule as CostRule,
      status: initialData.status as MatchStatus,
    };
  };

  const [form, setForm] = useState<FormState>(getDefaultForm());
  const [error, setError] = useState<string | null>(null);

  // Khi mở dialog hoặc initialData thay đổi thì cập nhật lại form
  // useEffect(() => {
  //   if (open) {
  //     setForm(getDefaultForm());
  //     setError(null);
  //   }
  // }, [initialData, open]);

  const updateMatch = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      minAge: form.minAge,
      maxAge: form.maxAge,
      fieldType: form.fieldType,
      timeNote: form.timeNote.trim(),
      description: form.description.trim(),
      costRule: form.costRule,

      ...(isEditing
        ? {
          status: form.status,
        }
        : {}),
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
      <DialogContent className="max-w-xl border-border bg-elevated text-text-primary">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            {isEditing ? "Sửa thông tin kèo đấu" : "Tạo kèo đấu"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">
          {/* Tuổi */}
          <div className="grid grid-cols-2 gap-2">
            <FieldWrapper className="flex-1">
              <FieldLabel className="text-text-primary">
                Tuổi (min)
              </FieldLabel>

              <Input
                type="number"
                min={0}
                value={form.minAge}
                onChange={(e) =>
                  updateMatch("minAge", Number(e.target.value))
                }
                className="border-border bg-surface text-text-primary placeholder:text-text-muted"
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-text-primary">
                Tuổi (max)
              </FieldLabel>

              <Input
                type="number"
                min={0}
                value={form.maxAge}
                onChange={(e) =>
                  updateMatch("maxAge", Number(e.target.value))
                }
                className="border-border bg-surface text-text-primary placeholder:text-text-muted"
              />
            </FieldWrapper>
          </div>

          {/* Thời gian */}
          <FieldWrapper>
            <FieldLabel className="text-text-primary">
              Thời gian dự kiến
            </FieldLabel>

            <Input
              value={form.timeNote}
              onChange={(e) =>
                updateMatch("timeNote", e.target.value)
              }
              placeholder="Ví dụ: 14h 22/07/2026"
              className="border-border bg-surface text-text-primary placeholder:text-text-muted"
            />
          </FieldWrapper>

          {/* Mô tả */}
          <FieldWrapper>
            <FieldLabel className="text-text-primary">
              Mô tả
            </FieldLabel>

            <Input
              value={form.description}
              onChange={(e) =>
                updateMatch("description", e.target.value)
              }
              placeholder="Nhập mô tả kèo đấu..."
              className="border-border bg-surface text-text-primary placeholder:text-text-muted"
            />
          </FieldWrapper>

          {/* Cost rule + Field type */}
          <div className="grid grid-cols-2 gap-2">
            <FieldWrapper>
              <FieldLabel className="text-text-primary">
                Hình thức trả tiền
              </FieldLabel>

              <Select
                value={form.costRule}
                onValueChange={(value) =>
                  updateMatch("costRule", value as CostRule)
                }
              >
                <SelectTrigger className="border-border bg-surface text-text-primary">
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>

                <SelectContent className="border-border bg-elevated text-text-primary">
                  <SelectItem value="SPLIT">
                    Chia đều
                  </SelectItem>

                  <SelectItem value="LOSER_PAYS">
                    Thua trả
                  </SelectItem>

                  <SelectItem value="WINNER_PAYS">
                    Thắng trả
                  </SelectItem>

                  <SelectItem value="NEGOTIATE">
                    Thương lượng
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel className="text-text-primary">
                Loại sân
              </FieldLabel>

              <Select
                value={form.fieldType}
                onValueChange={(value) =>
                  updateMatch("fieldType", value ?? "")
                }
              >
                <SelectTrigger className="border-border bg-surface text-text-primary">
                  <SelectValue placeholder="Chọn loại sân" />
                </SelectTrigger>

                <SelectContent className="border-border bg-elevated text-text-primary">
                  <SelectItem value="FIVE">
                    5-5
                  </SelectItem>

                  <SelectItem value="SEVEN">
                    7-7
                  </SelectItem>

                  <SelectItem value="ELEVEN">
                    11-11
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>

          {/* Người tạo */}
          {isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-text-primary">
                Người tạo kèo
              </FieldLabel>

              <Input
                value={form.fullName}
                disabled
                className="border-border bg-surface text-text-primary disabled:opacity-70"
              />
            </FieldWrapper>
          )}

          {/* Status */}
          {isEditing && (
            <FieldWrapper>
              <FieldLabel className="text-text-primary">
                Trạng thái
              </FieldLabel>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  updateMatch(
                    "status",
                    value as MatchStatus
                  )
                }
              >
                <SelectTrigger className="border-border bg-surface text-text-primary">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-border bg-elevated text-text-primary">
                  <SelectItem value="OPEN">
                    Đang mở
                  </SelectItem>

                  <SelectItem value="MATCHED">
                    Đã ghép
                  </SelectItem>

                  <SelectItem value="FINISHED">
                    Đã xong
                  </SelectItem>

                  <SelectItem value="CANCELLED">
                    Đã hủy
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}

          {/* Error */}
          {(error || serverError) && (
            <p className="text-sm text-status-danger">
              {error ?? serverError}
            </p>
          )}
        </FieldGroup>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-border text-text-primary"
          >
            Hủy
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover"
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