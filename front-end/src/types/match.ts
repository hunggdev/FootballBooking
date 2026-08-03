import type { User } from "./user";

export interface Match {
    matchId: number,
    userId: number,
    user: User,
    minAge: number,
    maxAge: number,
    fieldType: string,
    timeNote: string,
    description: string,
    costRule: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    isMine: boolean,
    isJoined: boolean,
    participantsCount: number,
}

export interface CreateMatchPayload {
    minAge: number,
    maxAge: number,
    fieldType: string,
    timeNote: string,
    description: string,
    costRule: string,
}

export interface UpdateMatchPayload {
    minAge: number | null,
    maxAge: number | null,
    fieldType: string,
    timeNote: string,
    description: string,
    costRule: string,
    status: string,
}

export interface Stats {
    matches: number,
    totalMatchInThisMonth: number,
    matchOpen: number,
    matchMatched: number,
    matchFinished: number,
    matchCancelled: number,
}