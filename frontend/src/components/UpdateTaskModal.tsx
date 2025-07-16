import { FC, useEffect, useState } from "react";
import Dialog from "./ui/Dialog";
import { useTodo } from "../context/TodoContext";
import axios from "axios";
import { BACKEND_URL } from "../config/url";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface UpdateTaskModalProps {
  taskId: string
  columnId: string
  open: boolean
  onClose: () => void
}

const UpdateTaskModal: FC<UpdateTaskModalProps> = ({ taskId, columnId, open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const { state, dispatch } = useTodo()

  const findingTask = () => {
    const column = state.columns.find((col) => col.id === columnId)
    const task = column?.tasks.find((task) => task.id === taskId)

    setTitle(task?.title || "")
    setDescription(task?.description || "")
  }

  const updateTask = async () => {
    try {
      setIsLoading(true)
      await axios.put(`${BACKEND_URL}/task/update`, 
        {
          title,
          description,
          taskId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  } 
  const handleSaveEdit = () => {
    if (title.trim() && description.trim()) {
      dispatch({
        type: "EDIT_TASK",
        taskId: taskId,
        updates: { title, description },
      });
    }
    updateTask()
    onClose()
    toast.success("Task updated successfully")
  };

  useEffect(() => {
    findingTask()
  }, [open])

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="modal-container">
        <h3 className="modal-title">Add Task</h3>
        <p className="modal-description">
          Update task in your todo.
        </p>
        <div className="modal-input-outer">
          <div className="modal-input-container">
            <label className="modal-label">Title</label>
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
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
            onClick={handleSaveEdit}
            className="modal-submit-button"
          >
            {isLoading ? <Loader className="loaderDiv" /> : null }
            Add task
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateTaskModal;
