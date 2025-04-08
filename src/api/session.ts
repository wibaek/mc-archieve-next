import { CreateSessionRequest } from "./types/session";
import api from "./client";

export const sessionApi = {
  // 세션 생성
  createSession: (data: CreateSessionRequest) => api.post("/v1/sessions", data),

  // 세션 조회
  getSession: (sessionId: number) => api.get(`/v1/sessions/${sessionId}`),

  // 세션 참가 요청
  requestJoin: (sessionId: number) =>
    api.post(`/v1/sessions/${sessionId}/join`),

  // 세션 참가 승인
  approveJoin: (sessionId: number, memberId: number) =>
    api.post(`/v1/sessions/${sessionId}/members/${memberId}/approve`),

  // 세션 참가 거절
  rejectJoin: (sessionId: number, memberId: number) =>
    api.post(`/v1/sessions/${sessionId}/members/${memberId}/reject`),

  // // 세션 목록 조회
  // getSessions: () =>
  //   api.get('/v1/sessions'),

  // // 세션 멤버 조회
  // getSessionMembers: (sessionId: number) =>
  //   api.get(`/v1/sessions/${sessionId}/members`),

  // // 세션 스토리 조회
  // getSessionStories: (sessionId: number) =>
  //   api.get(`/v1/sessions/${sessionId}/stories`),

  // 사용자의 세션 목록 조회
  getUserSessions: () => api.get("/v1/sessions/my"),

  // // 최근 세션 조회
  // getRecentSessions: () =>
  //   api.get('/v1/sessions/recent'),
};
