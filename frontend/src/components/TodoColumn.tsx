import { useState } from "react";
import { Plus } from "lucide-react";
import { useTodo } from "../context/TodoContext";
import { TaskCard } from "./TaskCard";
import type { Column } from "../types";
import { nanoid } from "nanoid";
import Dialog from "./ui/Dialog";
import axios from "axios";
import { BACKEND_URL } from "../config/url";
import { toast } from "sonner";

interface TodoColumnProps {
  column: Column;
}

export function TodoColumn({ column }: TodoColumnProps) {
  const { dispatch } = useTodo();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  if(!localStorage.getItem("userId")) {
    window.location.pathname="/signup"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("columnId");

    if (sourceColumnId !== column.id) {
      dispatch({
        type: "MOVE_TASK",
        fromColumnId: sourceColumnId,
        toColumnId: column.id,
        taskId,
      });
    }

    moveTaskInDB(taskId);
  };

  const moveTaskInDB = async (taskId: string) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/task/changeColumn`,
        {
          columnId: column.id,
          taskId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addTaskInDB = async (id: string) => {
    try {
      await axios.post(
        `${BACKEND_URL}/task/add`,
        {
          id,
          title: newTaskTitle,
          description,
          columnId: column.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const id = nanoid();
      dispatch({
        type: "ADD_TASK",
        columnId: column.id,
        task: {
          id,
          title: newTaskTitle,
          description: description,
          authorId: userId || "",
          labels: [],
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      addTaskInDB(id);
      setNewTaskTitle("");
      setDescription("");
      setOpen(false);
      toast.success("New task added")
    }
  };

  return (
    <div
      className="kanban-column"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="kanban-column-container">
        <div className="kanban-column-title-container">
          <h3 className="kanban-column-title ">{column.title}</h3>
          <span className="kanban-column-task-count ">{column.tasks.length}</span>
        </div>
        
      </div>

      <div className="border-b" />

      <div className="kanban-task-list">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} />
        ))}
      </div>

      <div>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="kanban-add-task-button"
        >
          <Plus className="plus-icon" />
          Add a card
        </button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <div className="modal-container">
            <h3 className="modal-title">Add Task</h3>
            <p className="modal-description">
              Add a new task in your todo.
            </p>
            <div className="modal-input-outer">
              <div className="modal-input-container ">
                <label className="modal-label">Title</label>
                <input
                  type="text"
                  placeholder="Title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                  }}
                  autoFocus
                  className="modal-input"
                />
              </div>

              <div className="modal-input-container">
                <label className="modal-label">Description</label>
                <textarea
                  placeholder="Write a short description about your text"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="modal-textarea"
                />
              </div>

              <button
                onClick={handleAddTask}
                className="modal-submit-button"
              >
                Add task
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
