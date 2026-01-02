import Button from "@/app/components/Button/Button";
import Loading from "@/app/components/Loading";

type SignupFormProps = {
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  closeModal: () => void;
  showPwdSignup: boolean;
  errorMsg?: string | null;
  toggleShowPwdSignup: () => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRepeatPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  match: boolean;
  loading: boolean;
};

export default function SignupForm({
  handleRegister,
  closeModal,
  showPwdSignup,
  errorMsg,
  toggleShowPwdSignup,
  onPasswordChange,
  onRepeatPasswordChange,
  match,
  loading,
}: SignupFormProps) {
  return (
    <form id="signupForm" onSubmit={handleRegister} style={{ zIndex: 1000 }}>
      <h1>Sign-up</h1>
      <p id="closeSignup" onClick={closeModal}>
        X
      </p>
      <label htmlFor="name">
        Full Name (i.e. Juan E. Dela Cruz)
        <input type="text" name="name" required />
      </label>
      <label htmlFor="age">
        Age
        <input type="text" name="age" required />
      </label>
      <label htmlFor="email">
        E-mail
        <input type="email" name="email" required />
      </label>
      <label htmlFor="password" id="password">
        Password
        <input
          type={showPwdSignup ? "text" : "password"}
          className="passwordInput"
          name="password"
          onChange={onPasswordChange}
          required
        />
        <img
          className="showPassword"
          src="../assets/images/eye.png"
          alt="Show Password"
          onClick={toggleShowPwdSignup}
          style={{ cursor: "pointer" }}
        />
      </label>
      <label htmlFor="repeatPassword" id="password">
        Password
        <input
          type={showPwdSignup ? "text" : "password"}
          className="passwordInput"
          name="repeatPassword"
          onChange={onRepeatPasswordChange}
          required
        />
        <img
          className="showPassword"
          src="../assets/images/eye.png"
          alt="Show Password"
          onClick={toggleShowPwdSignup}
          style={{ cursor: "pointer" }}
        />
      </label>
      {!match && <div style={{ color: "red" }}>Passwords do not match</div>}
      {errorMsg && (
        <div className="error" style={{ color: "red" }}>
          {errorMsg}
        </div>
      )}
      <Button
        type="submit"
        className="custom-button"
        loading={loading}
        loadingComponent={<Loading color="white" style={{ fontSize: "8px" }} />}
      >
        Sign-up
      </Button>
    </form>
  );
}
