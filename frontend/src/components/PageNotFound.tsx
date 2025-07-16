import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const PageNotFound = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/signup")
    toast.error("The page which you were trying to reach does not exists")
  }, [])

  return (
    <div>
      This page does not exits 404
    </div>
  )
}

export default PageNotFound