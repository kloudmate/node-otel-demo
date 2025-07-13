import axios from "axios"
import { BACKEND_URL } from "./config/url"



export const addColumnToDB = async (id: string, title: string) => {
    try {
      const column = await axios.post(`${BACKEND_URL}/task/addColumn`, 
        {
          columnId: id,
          title,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      return column
    } catch (error) {
      console.log(error)
    }
  } 