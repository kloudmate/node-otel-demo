import { TodoColumn } from "./TodoColumn"
import { AddColumnButton } from "./AddColumnButton"
import { Task } from "../types"

interface TodoBoardProps {
  filteredColumns: {
    id: string
    title: string
    tasks: Task[]
  }[]
}

export default function TodoBoard({ filteredColumns }: TodoBoardProps) {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="">
      <div className="kanban-container">
        <main className="kanban-main" onDragOver={handleDragOver}>
          <div className="kanban-columns">
            {filteredColumns.map((column) => (
              <TodoColumn key={column.id} column={column} />
            ))}
            <AddColumnButton />
          </div>
        </main>
      </div>
    </div>
  )
}

