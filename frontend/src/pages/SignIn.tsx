import SignInForm from "../components/SignInForm";
import Quote from "../components/Quote";


const SignIn = () => {
  return (
    <div className="auth-container">
      <div>
        <SignInForm />
      </div>
      <div className="quote-section">
        <Quote />
      </div>
    </div>
  );
};

export default SignIn;
