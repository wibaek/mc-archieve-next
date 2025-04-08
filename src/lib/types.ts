export interface User {
  id: string
  email: string
  name: string
  image?: string
  createdAt: Date
}

export interface Session {
  id: string
  name: string
  description?: string
  createdAt: Date
  ownerId: string
  owner?: User
  members?: User[]
  stories: Story[]
}

export interface Story {
  id: string
  sessionId: string
  name: string
  caption?: string
  url: string
  downloadUrl: string
  createdAt: Date
  userId: string
  user?: User
}

export interface SessionMember {
  sessionId: string
  userId: string
  role: "owner" | "member"
  joinedAt: Date
}

export interface MembershipRequest {
  id: string
  sessionId: string
  userId: string
  status: "pending" | "accepted" | "rejected"
  message?: string
  createdAt: Date
  updatedAt: Date
  user?: User
}

export interface SiteStats {
  totalMembers: number
  totalSessions: number
  totalImages: number
}
