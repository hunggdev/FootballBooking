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

const emptyForm = {
  userId: 0,
  fullName: "",
  minAge: 0,
  maxAge: 0,
  fieldType: "",
  timeNote: "",
  description: "",
  costRule: "",
  status: "OPEN" as "OPEN" | "MATCHED" | "CANCELLED" | "FINISHED",
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
  const defaultForm = initialData
    ? {
        fullName: initialData.user.fullName,
        minAge: initialData.minAge,
        maxAge: initialData.maxAge,
        fieldType: initialData.fieldType,
        timeNote: initialData.timeNote,
        description: initialData.description,
        costRule: initialData.costRule,
        status: initialData.status as "OPEN" | "MATCHED" | "CANCELLED" | "FINISHED",
      }
    : emptyForm;

const [form, setForm] = useState(defaultForm);

const [error, setError] = useState<string | null>(null);

  
  const updateMatch = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
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
      timeNote: form.timeNote,
      description: form.description,
      costRule: form.costRule,
      ...(isEditing ? { status: form.status } : {}),
    };

    onSubmit(payload);
  };

  const resetForm = () => {
  setForm(initialData ? defaultForm : emptyForm);
  setError(null);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa thông tin kèo đấu" : "Tạo kèo đấu"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="space-y-4">

          <div className="grid grid-cols-2 gap-2">
            <FieldWrapper className="flex-1">
              <FieldLabel>Tuổi (min)</FieldLabel>
              <Input
                value={form.minAge}
                onChange={(e) => updateMatch("minAge", Number(e.target.value))}
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel>Tuổi (max)</FieldLabel>
              <Input
                value={form.maxAge}
                onChange={(e) => updateMatch("maxAge", Number(e.target.value))}
              />
            </FieldWrapper>

            <FieldWrapper>
                <FieldLabel>Thời gian dự kiến</FieldLabel>
                <Input
                  value={form.timeNote}
                  onChange={(e) => updateMatch("timeNote", e.target.value)}
                  placeholder="Ex: 14h 22/7/2026"
                />
            </FieldWrapper>
          </div>

          <FieldWrapper>
              <FieldLabel>Mô tả</FieldLabel>
              <Input 
                value={form.description}
                onChange={(e) => updateMatch("description", e.target.value)}
              />
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-2">
            <FieldWrapper>
                <FieldLabel>Hình thức trả tiền</FieldLabel>
                <Select   
                  value={form.costRule}
                  onValueChange={(value) =>
                    updateMatch(
                      "costRule",
                      (value ?? "SPLIT") as "SPLIT" | "LOSER_PAYS" | "WINNER_PAYS" | "NEGOTIATE"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="SPLIT">Chia đều</SelectItem>
                    <SelectItem value="LOSER_PAYS">Thua trả</SelectItem>
                    <SelectItem value="WINNER_PAYS">Thắng trả</SelectItem>
                    <SelectItem value="NEGOTIATE">Thương lượng</SelectItem>
                  </SelectContent>
                </Select>
            </FieldWrapper>

            <FieldWrapper>
                <FieldLabel>Loại sân</FieldLabel>

                <Select   
                  value={form.fieldType}
                  onValueChange={(value) =>
                    updateMatch(
                      "fieldType",
                      (value ?? "FIVE") as "FIVE" | "SEVEN" | "ELEVEN"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="FIVE">5-5</SelectItem>
                    <SelectItem value="SEVEN">7-7</SelectItem>
                    <SelectItem value="ELEVEN">11-11</SelectItem>
                  </SelectContent>
                </Select>
            </FieldWrapper>
          </div>

          {isEditing && (
            <FieldWrapper>
              <FieldLabel>Người tạo kèo</FieldLabel>
              <Input
                value={form.fullName}
                disabled
              />
            </FieldWrapper>
          )}
          {isEditing && (
            <FieldWrapper>
              <FieldLabel>Trạng thái</FieldLabel>

              <Select   
                value={form.status}
                onValueChange={(value) =>
                  updateMatch(
                    "status",
                    (value ?? "ACTIVE") as
                      | "OPEN"
                      | "MATCHED"
                      | "CANCELLED"
                      | "FINISHED"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
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

          {(error || serverError) && (
            <p className="text-sm text-red-500">
              {error ?? serverError}
            </p>
          )}

        </FieldGroup>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {onOpenChange(false); resetForm();}}
          >
            Hủy
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
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