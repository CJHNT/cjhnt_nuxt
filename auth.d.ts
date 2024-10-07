// auth.d.ts
declare module '#auth-utils' {
  interface User {
    email: string
    role: 'admin' | 'project' | 'user'
    verifiedEmail: boolean
    wantsUpdates: boolean
  }
}

export {}
