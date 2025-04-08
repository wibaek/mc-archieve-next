import { CreateStoryRequest } from "./types/story";
import api from "./client";

export const storyApi = {
  // 스토리 생성
  createStory: (data: CreateStoryRequest) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            sessionId: data.sessionId,
            caption: data.caption,
          }),
        ],
        { type: "application/json" },
      ),
    );

    return api.post("/v1/stories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 스토리 조회
  getStory: (storyId: number) => api.get(`/v1/stories/${storyId}`),

  // 스토리 삭제
  deleteStory: (storyId: number) => api.delete(`/v1/stories/${storyId}`),

  // 최근 스토리 조회
  getRecentStories: () => api.get("/v1/stories/recent"),
};
