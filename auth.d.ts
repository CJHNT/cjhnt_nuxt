// auth.d.ts
declare module '#auth-utils' {
  interface User {
    email: String
    role: 'admin' | 'project' | 'user'
    verifiedEmail: Boolean
    wantsUpdates: Boolean
  }
}

export {}
