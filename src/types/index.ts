export interface User {
  email: string
  password: string
}

export interface Task {
  title: string
  description: string
  created_at: string
  id?: number
  updated_at?: string
  status: number
  user_id?: number
}
export interface StatusOption {
  status: number
  title: string
}
