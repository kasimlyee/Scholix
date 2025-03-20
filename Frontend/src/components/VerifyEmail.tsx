import { useState } from "react";
import { FaCheckCircle, FaKey, FaRedo } from "react-icons/fa";

interface verifyProps {
  email: string;
  onVerify: (
    code: string,
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  onResend: () => void;
}

const VerifyEmail: React.FC<verifyProps> = ({ email, onVerify, onResend }) => {
  const [code, setCode] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      alert("Please enter a 6-digit code.");
      return;
    }
    onVerify(code, setIsVerified);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "25rem" }}>
        <div className="text-center">
          <FaCheckCircle size={50} className="text-success mb-3" />
          <h4>Email Verification</h4>
          <p className="text-muted">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>
        {isVerified ? (
          <div className="alert alert-success text-center">
            {" "}
            Email verified successfully!
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <FaKey />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-sucess w-100">
              Verify
            </button>
            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={onResend}
            >
              <FaRedo /> Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
