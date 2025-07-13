import type React from "react"

export interface Task {
  id: string
  title: string
  description: string
  authorId: string
  comments: Comment[]
  labels?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  text: string
  taskId: string
  author: string
  createdAt: Date 
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

export interface TodoState {
  columns: Column[]
  history: Column[][] // For undo functionality
  darkMode: boolean
}

export interface KanbanContextType {
  state: TodoState
  dispatch: React.Dispatch<TodoAction>
}

export type TodoAction =
| { type: "ADD_TASK"; columnId: string; task: Task }
| { type: "EDIT_TASK"; taskId: string; updates: Partial<Task> }
| { type: "DELETE_TASK"; columnId: string; taskId: string }
| { type: "MOVE_TASK"; fromColumnId: string; toColumnId: string; taskId: string }
| { type: "ADD_COLUMN"; column: Column }
| { type: "ADD_COMMENT"; taskId: string; comment: Comment }
| { type: "TOGGLE_THEME" }
| { type: "UNDO" }

