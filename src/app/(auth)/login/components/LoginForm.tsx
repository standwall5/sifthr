type LoginFormProps = {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  closeModal: () => void;
  showPwdLogin: boolean;
  errorMsg?: string | null;
  toggleShowPwdLogin: () => void;
};

export default function LoginForm({
  handleLogin,
  closeModal,
  showPwdLogin,
  errorMsg,
  toggleShowPwdLogin,
}: LoginFormProps) {
  return (
    <form id="loginForm" onSubmit={handleLogin}>
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
      <button type="submit" className="custom-button">
        Login
      </button>
    </form>
  );
}
