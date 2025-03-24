import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

// Define SignUpProps (move to a shared types file if reused)
interface SignUpProps {
  availableRoles?: string[]; // Optional prop
}

const SignUp: React.FC<SignUpProps> = ({
  availableRoles: initialRoles = [],
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState(initialRoles);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/available-roles`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setAvailableRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch available roles");
      }
    };
    if (user.token) fetchRoles();
  }, [user.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        { email, password, role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAvailableRoles(availableRoles.filter((r) => r !== role));
      // Optionally redirect or show success message
    } catch (error) {
      console.error("Signup failed");
    }
  };

  return (
    <div>
      <h1>Sign Up New User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          {availableRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
