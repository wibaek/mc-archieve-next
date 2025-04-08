import type { MembershipRequest, Session, SiteStats, User } from "./types"

// 이 파일은 실제로는 데이터베이스 연결이 필요합니다
// 현재는 예시 데이터를 반환합니다

const SAMPLE_USERS: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "테스트 사용자",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    email: "user2@example.com",
    name: "두 번째 사용자",
    createdAt: new Date("2023-01-05"),
  },
]

const SAMPLE_SESSIONS: Session[] = [
  {
    id: "1",
    name: "서바이벌 서버",
    description: "친구들과 함께하는 서바이벌 서버",
    createdAt: new Date("2023-01-15"),
    ownerId: "1",
    members: [SAMPLE_USERS[0]],
    stories: [
      {
        id: "1",
        sessionId: "1",
        name: "나의 첫 집",
        caption: "서버에서 처음 지은 나무 집입니다.",
        url: "/placeholder.svg?height=500&width=500",
        downloadUrl: "/placeholder.svg?height=500&width=500",
        createdAt: new Date("2023-01-20"),
        userId: "1",
      },
      {
        id: "2",
        sessionId: "1",
        name: "농장",
        caption: null,
        url: "/placeholder.svg?height=500&width=500",
        downloadUrl: "/placeholder.svg?height=500&width=500",
        createdAt: new Date("2023-01-25"),
        userId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "크리에이티브 월드",
    description: "건축 프로젝트",
    createdAt: new Date("2023-02-10"),
    ownerId: "2",
    members: [SAMPLE_USERS[1]],
    stories: [],
  },
]

// 예시 멤버십 요청 데이터
const SAMPLE_MEMBERSHIP_REQUESTS: MembershipRequest[] = [
  {
    id: "1",
    sessionId: "2",
    userId: "1",
    status: "pending",
    message: "서버에 참여하고 싶습니다!",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
    user: SAMPLE_USERS[0],
  },
]

export async function getSessionsWithStories(): Promise<Session[]> {
  // 실제로는 데이터베이스에서 세션과 스토리를 가져옵니다
  return SAMPLE_SESSIONS
}

export async function getSessionWithStories(id: string): Promise<Session | null> {
  // 실제로는 데이터베이스에서 특정 세션과 스토리를 가져옵니다
  return SAMPLE_SESSIONS.find((session) => session.id === id) || null
}

export async function getSession(id: string): Promise<Session | null> {
  // 실제로는 데이터베이스에서 특정 세션을 가져옵니다
  return SAMPLE_SESSIONS.find((session) => session.id === id) || null
}

export async function getSiteStats(): Promise<SiteStats> {
  // 실제로는 데이터베이스에서 통계 정보를 가져옵니다
  const totalMembers = SAMPLE_USERS.length
  const totalSessions = SAMPLE_SESSIONS.length
  const totalImages = SAMPLE_SESSIONS.reduce((acc, session) => acc + session.stories.length, 0)

  return {
    totalMembers,
    totalSessions,
    totalImages,
  }
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  // 실제로는 데이터베이스에서 사용자의 세션을 가져옵니다
  return SAMPLE_SESSIONS.filter(
    (session) => session.ownerId === userId || session.members?.some((member) => member.id === userId),
  )
}

export async function getSessionMembershipRequests(sessionId: string): Promise<MembershipRequest[]> {
  // 실제로는 데이터베이스에서 세션의 멤버십 요청을 가져옵니다
  return SAMPLE_MEMBERSHIP_REQUESTS.filter((request) => request.sessionId === sessionId && request.status === "pending")
}

export async function getUserMembershipRequests(userId: string): Promise<MembershipRequest[]> {
  // 실제로는 데이터베이스에서 사용자의 멤버십 요청을 가져옵니다
  return SAMPLE_MEMBERSHIP_REQUESTS.filter((request) => request.userId === userId)
}

export async function checkMembershipRequest(sessionId: string, userId: string): Promise<MembershipRequest | null> {
  // 실제로는 데이터베이스에서 특정 세션에 대한 사용자의 멤버십 요청을 확인합니다
  return (
    SAMPLE_MEMBERSHIP_REQUESTS.find((request) => request.sessionId === sessionId && request.userId === userId) || null
  )
}

export async function isSessionMember(sessionId: string, userId: string): Promise<boolean> {
  // 실제로는 데이터베이스에서 사용자가 세션의 멤버인지 확인합니다
  const session = await getSession(sessionId)
  if (!session) return false

  return session.ownerId === userId || session.members?.some((member) => member.id === userId) || false
}
