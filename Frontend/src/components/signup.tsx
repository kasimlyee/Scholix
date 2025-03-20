import { useState } from "react";
import { FaSchool, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

interface SignupProps {
  onSignup: (email: string, password: string, role: string) => void;
}

interface Errors {
  email?: JSX.Element;
  password?: JSX.Element;
  role?: JSX.Element;
}

const SignUp: React.FC<SignupProps> = ({ onSignup }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const newErrors: Errors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = (
        <div className="alert alert-warning">
          Please enter a valid email address.
        </div>
      );
    }

    if (
      !password ||
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      newErrors.password = (
        <div className="alert alert-warning">
          Password muct be at least 8 characters long, containing a letter, a
          number and a special character.
        </div>
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSignup(email, password, role);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: "25rem" }}>
          <div className="text-center">
            <FaSchool size={50} className="text-primary mb-3" />
            <h4>School Management System</h4>
            <p className="text-muted">Create an Account</p>
          </div>
          <form onSubmit={handeSubmit}>
            {/**Email */}
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter your Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div>{errors.email}</div>}
            </div>

            {/**Password */}
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <div>{errors.password}</div>}
            </div>

            {/**Role Dropdown */}
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <FaUserTag />
              </span>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Administrator</option>
                <option value="Librarian">Librarian</option>
                <option value="Bursar">Bursar</option>
                <option value="DOS">DOS</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
