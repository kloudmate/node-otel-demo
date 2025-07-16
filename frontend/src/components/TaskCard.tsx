import { useState } from "react";
import { Edit2, Trash2, MessageSquareX, MessageSquarePlus } from "lucide-react";
import { useTodo } from "../context/TodoContext";
import type { Task } from "../types";
import type React from "react";
import { nanoid } from "nanoid";
import UpdateTaskModal from "./UpdateTaskModal";
import { format } from "date-fns";
import axios from "axios";
import { BACKEND_URL } from "../config/url";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export function TaskCard({ task, columnId }: TaskCardProps) {
  const { dispatch } = useTodo();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [open, setOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("columnId", columnId);
  };

  const deleteTaskInDB = async () => {
    try {
      await axios.delete(
        `${BACKEND_URL}/task/delete/${task.id}`,
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

  const handleDelete = () => {
    dispatch({
      type: "DELETE_TASK",
      columnId,
      taskId: task.id,
    });
    deleteTaskInDB();
    toast.warning("Task deleted successfully")
  };

  const addCommentToDB = async (id: string) => {
    try {
      await axios.post(
        `${BACKEND_URL}/task/addComment`,
        {
          id,
          text: newComment,
          taskId: task.id,
          authorId: localStorage.getItem("userId") 
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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const id = nanoid();
      dispatch({
        type: "ADD_COMMENT",
        taskId: task.id,
        comment: {
          id,
          text: newComment,
          taskId: task.id,
          createdAt: new Date(),
          author: "JD",
        },
      });
      addCommentToDB(id);
      setNewComment("");
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="task-card"
    >
      <div className="">
        <div className="task-header">
          <div className="">
            <h4 className="task-title">
              {task.title}
            </h4>
            <p className="task-description">
              {task.description}
            </p>
          </div>
          <div className="task-actions">
            <button
              onClick={() => setOpen(true)}
              className="task-action-button "
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <UpdateTaskModal
              open={open}
              onClose={() => setOpen(false)}
              taskId={task.id}
              columnId={columnId}
            />
            <button
              onClick={handleDelete}
              className="task-action-button"
            >
              <Trash2 className="plus-icon" />
            </button>
          </div>
        </div>

        {/* {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600 "
                >
                  {label}
                </span>
              ))}
            </div>
          )} */}

        <div className="task-footer">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 hover:text-gray-700 "
          >
            {showComments ? (
              <MessageSquareX className="w-4 h-4" />
            ) : (
              <MessageSquarePlus className="w-4 h-4" />
            )}
            {task.comments.length}
          </button>
          <div className="w-10  text-zinc-600 flex items-center justify-center text-xs">
            {format(new Date(task.createdAt), "MMM d")}
          </div>
        </div>

        {showComments && (
          <div className="comment-section">
            <div className="comment-input-container">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input "
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
              />
              <button
                onClick={handleAddComment}
                className="comment-button"
              >
                Add
              </button>
            </div>

            <div className="comment-list">
              {task.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="comment-item "
                >
                  <div className="comment-header">
                    <div className="comment-avatar">
                      <img
                        src={"/logo.png"}
                        alt="CN"
                        className="aspect-square h-full w-full"
                      />
                    </div>
                    <span className="comment-date ">
                      {format(new Date(task.createdAt), "MMM d")}
                    </span>
                  </div>
                  <p className="break-all break-words">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
