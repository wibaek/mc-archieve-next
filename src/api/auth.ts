import { LoginRequest, SignUpRequest } from "./types/auth";
import api from "./client";

export const authApi = {
  login: (data: LoginRequest) => api.post("/v1/login", data),

  signup: (data: SignUpRequest) => api.post("/v1/signup", data),
};
