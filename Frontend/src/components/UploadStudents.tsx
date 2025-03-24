import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Container,
  Button,
  Table,
  Form,
  Spinner,
  Tabs,
  Tab,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import "../theme.css";

import Admission from "./Admission";
import { Student } from "./Admission";
import StudentModel from "./StudentModel";

const UploadStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [showModel, setShowModel] = useState(false);

  const showAdmissionModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Student[]>(
        `${import.meta.env.VITE_BACKEND_URL}/api/students/class/:${selectedClass}`
      );
      setStudents(response.data);
      setMessage("");
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("❌ Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/students/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ File uploaded successfully!");
    } catch (error) {
      setMessage("❌ Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  const handleCard = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/device/card?ip=http://localhost:8843&username=Kasim&password=@Kas!m1223`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("An Error occurred!");
    }
  };

  const handleOpenModal = () => {
    console.log("handleOpenModal clicked");
    handleCard()
      .then((data) => {
        console.log(data);
        setStudent(data); // Set the student data
        setShowModel(true); // Now open the modal
      })
      .catch((error) => {
        console.error("Error fetching card data:", error);
      });
  };

  return (
    <Container className="container-custom mt-4">
      <h2 className="text-center text-primary">📚 Student Management</h2>
      <Tabs defaultActiveKey="manage" className="mb-3">
        {/* 📌 Student Management */}
        <Tab eventKey="manage" title="Manage Students">
          <Form.Group className="mt-3">
            <Form.Label>Select Class:</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">-- Select Class --</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
              <option value="S5">S5</option>
              <option value="S6">S6</option>
            </Form.Control>
          </Form.Group>

          <div className="d-flex mt-3">
            <Button
              variant="success"
              onClick={fetchStudents}
              disabled={!selectedClass}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "View Students"
              )}
            </Button>

            <Button
              variant="warning"
              className="ms-3"
              onClick={showAdmissionModal}
            >
              ➕ Register Student
            </Button>

            <Button
              variant="primary"
              className="ms-3"
              onClick={handleExportToExcel}
            >
              <FaFileExcel /> Export to Excel
            </Button>
            <Button
              variant="primary"
              className="ms-3"
              onClick={handleOpenModal}
            >
              <FaFileExcel /> Card
            </Button>
          </div>

          {students.length > 0 && (
            <Table striped bordered hover className="table-custom mt-4">
              <thead>
                <tr>
                  <th>ID Number</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Phone Number</th>
                  <th>Class</th>
                  <th>Parent/Guardin's Name</th>
                  <th>Telephone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.idNumber}>
                    <td>{student.idNumber}</td>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.age}</td>
                    <td>{student.phoneNumber}</td>
                    <td>{student.enrolledClass}</td>
                    <td>{student.parentName}</td>
                    <td>{student.parentPhoneNumner}</td>
                    <td>
                      <Button variant="warning" size="sm">
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" className="ms-2">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* 📌 Upload Excel */}
        <Tab eventKey="upload" title="Upload Students">
          <Form.Group className="mt-3">
            <Form.Label>Select Excel File:</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleUpload} className="mt-3">
            Upload Excel
          </Button>
        </Tab>
      </Tabs>
      <Admission showModal={showModal} setShowModal={setShowModal} />;
      <StudentModel
        showModal={showModel}
        setShowModal={setShowModel}
        student={student ?? undefined}
      />
    </Container>
  );
};

export default UploadStudents;
