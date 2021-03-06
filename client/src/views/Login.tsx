import { auth } from "../api";
import { useNavigate } from "react-router-dom";
import { LoginPayload } from "../domain/Auth";
import LoginForm from "../components/LoginForm";
import toast from "react-hot-toast";
import onError from "../utils/onError";

export default function Login() {
  const navigate = useNavigate();

  const onLoginButtonClick = async (data: LoginPayload) => {
    try {
      const token = await auth.login(data.identifier, data.password);

      if (token) {
        toast.success("You are logged in!");
        navigate("/employees");
      }
    } catch (error) {
      onError(error);
    }
  };
  return (
    <div>
      <LoginForm onLoginButtonClick={onLoginButtonClick} />
    </div>
  );
}
