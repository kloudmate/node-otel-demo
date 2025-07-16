import { useEffect, useState } from "react";
import KanbanBoard from "../components/TodoBoard";
import Navbar from "../components/Navbar";
import { useTodo } from "../context/TodoContext";
import { Column } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../config/url";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const { state, dispatch } = useTodo();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const filteredColumns = state.columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data }: { data: Column[] } = await axios.get(
        `${BACKEND_URL}/task/columnData`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(data);
      if (data) {
        data.map((item) => {
          dispatch({ type: "ADD_COLUMN", column: { id: item.id, title: item.title, tasks: item.tasks }})
        })
        console.log(state.columns)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Hello")
  }, []);

  if(!localStorage.getItem("userId")) {
    navigate("/signup")
    return null
  }

  if (isLoading) {
    return (
      <div>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="animate-spin h-6 w-6" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <KanbanBoard filteredColumns={filteredColumns} />
    </>
  );
}

export default Home;
