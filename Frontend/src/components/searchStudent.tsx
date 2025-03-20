import axios from "axios";
import { useState } from "react";

interface Student {
  id: number;
  name: String;
}
export default function searchStudent() {
  const [id, setId] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get<Student>(
        `http://localhost:8080/api/students/${id}`
      );
      setStudent(response.data);
      setError(null);
    } catch (err) {
      setStudent(null);
      setError("User not found");
    }
  };

  return <div>searchStudent</div>;
}
