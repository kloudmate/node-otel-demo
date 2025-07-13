import { createContext, useContext, useReducer } from "react";
import { produce } from "immer";
import type { TodoState, TodoAction, Column } from "../types";

const initialColumns: Column[] = [];

const initialState: TodoState = {
  columns: initialColumns,
  history: [initialColumns],
  darkMode: false,
};

const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
} | null>(null);

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD_TASK": {
        const column = draft.columns.find((col) => col.id === action.columnId);
        if (column) {
          column.tasks.push(action.task);
          draft.history.push(JSON.parse(JSON.stringify(draft.columns)));
        }
        break;
      }
      case "EDIT_TASK": {
        const column = draft.columns.find((col) =>
          col.tasks.some((task) => task.id === action.taskId)
        );
        if (column) {
          const task = column.tasks.find((t) => t.id === action.taskId);
          if (task) {
            Object.assign(task, action.updates);
            draft.history.push(JSON.parse(JSON.stringify(draft.columns)));
          }
        }
        break;
      }
      case "DELETE_TASK": {
        const column = draft.columns.find((col) => col.id === action.columnId);
        if (column) {
          column.tasks = column.tasks.filter(
            (task) => task.id !== action.taskId
          );
          draft.history.push(JSON.parse(JSON.stringify(draft.columns)));
        }
        break;
      }
      case "MOVE_TASK": {
        const sourceColumn = draft.columns.find(
          (col) => col.id === action.fromColumnId
        );
        const targetColumn = draft.columns.find(
          (col) => col.id === action.toColumnId
        );
        if (sourceColumn && targetColumn) {
          const taskIndex = sourceColumn.tasks.findIndex(
            (task) => task.id === action.taskId
          );
          if (taskIndex !== -1) {
            const [task] = sourceColumn.tasks.splice(taskIndex, 1);
            targetColumn.tasks.push(task);
            draft.history.push(JSON.parse(JSON.stringify(draft.columns)));
          }
        }
        break;
      }
      case "ADD_COLUMN": {
        draft.columns.push(action.column);
        draft.history.push(JSON.parse(JSON.stringify(draft.columns)));
        break;
      }
      case "ADD_COMMENT": {
        draft.columns.forEach((column) => {
          const task = column.tasks.find((t) => t.id === action.taskId);
          if (task) {
            task.comments.push(action.comment);
            draft.history.push(JSON.parse(JSON.stringify(draft.columns)));
          }
        });
        break;
      }
    }
  });
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
