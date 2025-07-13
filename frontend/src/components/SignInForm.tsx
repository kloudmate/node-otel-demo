import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/url";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface SignInInputProps {
  email: string;
  password: string;
}

const SignInForm = () => {
  const navigate = useNavigate();
  const [postInput, setPostInput] = useState<SignInInputProps>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post(
        `${BACKEND_URL}/user/signin`,
        postInput
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Check whether you have to put update or not.
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error("Email or password incorrect")
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false)
    }
  };

  
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          Login to your account
        </h1>
        <div className="login-text">
          Already have an account?{" "}
          <Link to="/signup" className="underline">
            SignUp
          </Link>
        </div>

        <div className="input-container">
          <LabelledInput
            label="email"
            placeholder="xyz@xyz.com"
            onChange={(e) => {
              setPostInput((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
          />
          <LabelledInput
            label="Password"
            type="password"
            placeholder="password..."
            onChange={(e) => {
              setPostInput((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />

          <button
            type="button"
            onClick={onSignIn}
            className="login-button"
          >
            {isLoading ? <Loader className="loader-icon" /> : null }
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputProps {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputProps) {
  return (
    <div>
      <label className="input-label">
        {label}
      </label>
      <input
        type={type || "text"}
        id={label}
        onChange={onChange}
        className="input-field"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default SignInForm;
