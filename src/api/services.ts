import api from "./client";

// 인터페이스 정의
export interface Session {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  memberCount?: number;
}

export interface Story {
  id: number;
  caption: string;
  imageUrl: string;
  sessionId: number;
  sessionName: string;
  createdAt: string;
}

export interface User {
  id: number;
  nickname: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// 인증 관련 API
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/v1/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/v1/auth/signup", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/v1/my");
    return response.data;
  },
};

// 세션 관련 API
export const sessionService = {
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get<Session[]>("/v1/sessions");
    return response.data;
  },

  getSessionById: async (id: number): Promise<Session> => {
    const response = await api.get<Session>(`/v1/sessions/${id}`);
    return response.data;
  },

  createSession: async (
    data: Omit<Session, "id" | "createdAt">,
  ): Promise<Session> => {
    const response = await api.post<Session>("/v1/sessions", data);
    return response.data;
  },

  updateSession: async (
    id: number,
    data: Partial<Session>,
  ): Promise<Session> => {
    const response = await api.put<Session>(`/v1/sessions/${id}`, data);
    return response.data;
  },

  deleteSession: async (id: number): Promise<void> => {
    await api.delete(`/v1/sessions/${id}`);
  },
};

// 스토리 관련 API
export const storyService = {
  // 모든 스토리 가져오기 (세션 ID 필요 없음)
  getAllStories: async (): Promise<Story[]> => {
    // 모든 세션의 스토리를 가져오는 API가 있다면 사용
    // 없다면 세션별로 가져와서 합치는 방식 사용
    const sessions = await sessionService.getSessions();
    const storiesPromises = sessions.map((session) =>
      storyService.getStoriesBySessionId(session.id),
    );
    const storiesArrays = await Promise.all(storiesPromises);
    return storiesArrays.flat();
  },

  // 특정 세션의 스토리 가져오기
  getStoriesBySessionId: async (sessionId: number): Promise<Story[]> => {
    const response = await api.get<Story[]>(
      `/v1/sessions/${sessionId}/stories`,
    );
    return response.data;
  },

  // 특정 스토리 상세 정보 가져오기
  getStoryById: async (sessionId: number, storyId: number): Promise<Story> => {
    const response = await api.get<Story>(
      `/v1/sessions/${sessionId}/stories/${storyId}`,
    );
    return response.data;
  },

  // 스토리 생성
  createStory: async (sessionId: number, data: FormData): Promise<Story> => {
    const response = await api.post<Story>(
      `/v1/sessions/${sessionId}/stories`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // 스토리 수정
  updateStory: async (
    sessionId: number,
    storyId: number,
    data: Partial<Story>,
  ): Promise<Story> => {
    const response = await api.put<Story>(
      `/v1/sessions/${sessionId}/stories/${storyId}`,
      data,
    );
    return response.data;
  },

  // 스토리 삭제
  deleteStory: async (sessionId: number, storyId: number): Promise<void> => {
    await api.delete(`/v1/sessions/${sessionId}/stories/${storyId}`);
  },
};
