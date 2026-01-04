import Loading from "@/app/components/Loading";
import Button from "@/app/components/Button/Button";
import { login } from "@/lib/auth-actions";

type LoginFormProps = {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  closeModal: () => void;
  showPwdLogin: boolean;
  errorMsg?: string | null;
  toggleShowPwdLogin: () => void;
  loading: boolean;
};

export default function LoginForm({
  handleLogin,
  closeModal,
  showPwdLogin,
  errorMsg,
  toggleShowPwdLogin,
  loading,
}: LoginFormProps) {
  return (
    <form id="loginForm">
      <h1>Login</h1>
      <p id="closeLogin" onClick={closeModal}>
        X
      </p>
      <label htmlFor="email">
        E-mail
        <input type="email" name="email" id="email" required />
      </label>
      <label htmlFor="passwordInput" id="password">
        Password
        <input
          type={showPwdLogin ? "text" : "password"}
          className="passwordInput"
          name="password"
          id="passwordInput"
          required
        />
        <img
          className="showPassword"
          src="../assets/images/eye.png"
          alt="Show password"
          onClick={toggleShowPwdLogin}
          style={{ cursor: "pointer" }}
        />
      </label>
      {errorMsg && (
        <div className="error" style={{ color: "red" }}>
          {errorMsg}
        </div>
      )}
      <Button
        type="submit"
        className="custom-button"
        loading={loading}
        formAction={login}
        loadingComponent={<Loading color="white" style={{ fontSize: "8px" }} />}
      >
        Login
      </Button>
    </form>
  );
}
