import { useState } from "react";
import { FaSchool, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import "../theme.css";

interface Errors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const { login } = useAuth();

  const validate = () => {
    const newErrors: Errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        await login(email, password);
        setMessage("Login successful!");
      } catch (error) {
        setMessage("Login failed. Check your credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Rest of the component remains the same
  return (
    <div className="login-container">
      <div className="card-login">
        <div className="text-center mb-4">
          <FaSchool size={50} className="text-primary mb-3" />
          <h4>School Management System</h4>
          <p className="text-muted">Sign In</p>
        </div>
        <Form onSubmit={handleSubmit}>
          {/* Form fields unchanged */}
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              required
              aria-label="Email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              required
              aria-label="Password"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </InputGroup>

          <Button type="submit" className="btn-login w-100" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : "Sign In"}
          </Button>
          {message && (
            <Alert
              variant={message.includes("failed") ? "danger" : "success"}
              className="mt-3"
            >
              {message}
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Login;
