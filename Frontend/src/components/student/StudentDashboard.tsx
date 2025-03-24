import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Navigate } from "react-router-dom";
import {
  Container,
  Button,
  Tabs,
  Tab,
  Form,
  Spinner,
  Row,
  Col,
  Badge,
  ListGroup,
  Modal,
  Navbar,
  Nav,
  Dropdown,
  ToastContainer,
} from "react-bootstrap";
import {
  FaTrash,
  FaFileExcel,
  FaSun,
  FaMoon,
  FaBell,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentProfile from "./StudentProfile";
import AttendanceChart from "./AttendanceChart";
import IncidentManagement from "./IncidentManagement";
import {
  Student,
  Incident,
  AcademicRecord,
  MedicalRecord,
} from "../../types/Student";
import "../../theme.css";
import { Table } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<any>(null);
  const [subjectAnalysis, setSubjectAnalysis] = useState<any[]>([]);
  const [behaviorTrends, setBehaviorTrends] = useState<any[]>([]);
  const [theme, setTheme] = useState("light");
  const [highContrast, setHighContrast] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [classStats, setClassStats] = useState<any>(null);
  const [user, setUser] = useState<{
    email: string;
    role: string;
    token: string;
  } | null>(null);
  const studentsPerPage = 10;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [theme, highContrast]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchClassStats();
    }
  }, [selectedClass]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");
    if (token && userRole && userEmail) {
      setUser({ email: userEmail, role: userRole, token });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (selectedStudent) {
      fetchAttendanceReport("monthly");
      fetchSubjectAnalysis();
      fetchBehaviorTrends();
    }
  }, [selectedStudent]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "Admin") {
    // Adjust based on dashboard access
    return (
      <div>
        Access Denied: You do not have permission to view this Page.
      </div>
    );
  }

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Student[]>(
        `${import.meta.env.VITE_BACKEND_URL}/students/class/${selectedClass}`
      );
      setStudents(response.data);
      toast.success("Students loaded successfully!");
    } catch (error) {
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStats = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/students/class-stats/${selectedClass}`
      );
      setClassStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch class stats.");
    }
  };

  const handleAddStudent = async (
    studentData: Omit<
      Student,
      | "id"
      | "idNumber"
      | "points"
      | "incidents"
      | "attendance"
      | "academicHistory"
      | "medicalHistory"
    >
  ) => {
    try {
      const newStudent: Student = {
        ...studentData,
        id: crypto.randomUUID(),
        idNumber: "IDnumber",
        points: 0,
        incidents: [],
        attendance: [],
        academicHistory: [],
        medicalHistory: [],
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students`,
        newStudent
      );
      setStudents([...students, response.data]);
      toast.success("Student added successfully!");
      setNotifications([
        ...notifications,
        `New student ${newStudent.firstName} ${newStudent.lastName} added`,
      ]);
    } catch (error) {
      toast.error("Failed to add student.");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.warn("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students/upload`,
        formData
      );
      toast.success("Students uploaded successfully!");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to upload students.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      selectedStudents.length
        ? students.filter((s) => selectedStudents.includes(s.id))
        : students
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `students_${selectedClass}.xlsx`);
  };

  const handleAddIncident = async (incident: Incident) => {
    if (!selectedStudent) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/incidents`,
        incident
      );
      setSelectedStudent({
        ...selectedStudent,
        incidents: [...selectedStudent.incidents, response.data],
      });
      toast.success("Incident added successfully!");
      setNotifications([
        ...notifications,
        `New incident for ${selectedStudent.firstName} ${selectedStudent.lastName}`,
      ]);
    } catch (error) {
      toast.error("Failed to add incident.");
    }
  };

  const handleNotifyParent = async (incidentId: string) => {
    if (!selectedStudent) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/notify`,
        { incidentId }
      );
      toast.success("Parent notified successfully!");
    } catch (error) {
      toast.error("Failed to notify parent.");
    }
  };

  const handleUpdateIncidentStatus = async (
    incidentId: string,
    status: Incident["status"]
  ) => {
    if (!selectedStudent) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/incidents/${incidentId}`,
        { status }
      );
      setSelectedStudent({
        ...selectedStudent,
        incidents: selectedStudent.incidents.map((inc) =>
          inc.id === incidentId ? { ...inc, status } : inc
        ),
      });
      toast.success("Incident status updated!");
    } catch (error) {
      toast.error("Failed to update incident status.");
    }
  };

  const handleAddAttendance = async (attendance: {
    date: string;
    status: "present" | "absent" | "late";
  }) => {
    if (!selectedStudent) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/attendance`,
        attendance
      );
      setSelectedStudent({
        ...selectedStudent,
        attendance: [...selectedStudent.attendance, response.data],
      });
      fetchAttendanceReport("monthly");
      toast.success("Attendance added!");
    } catch (error) {
      toast.error("Failed to add attendance.");
    }
  };

  const handleAddAcademicRecord = async (record: AcademicRecord) => {
    if (!selectedStudent) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/academic`,
        record
      );
      setSelectedStudent({
        ...selectedStudent,
        academicHistory: [...selectedStudent.academicHistory, response.data],
      });
      fetchSubjectAnalysis();
      toast.success("Academic record added!");
    } catch (error) {
      toast.error("Failed to add academic record.");
    }
  };

  const handleAddMedicalRecord = async (record: Omit<MedicalRecord, "id">) => {
    if (!selectedStudent) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/medical`,
        record
      );
      setSelectedStudent({
        ...selectedStudent,
        medicalHistory: [...selectedStudent.medicalHistory, response.data],
      });
      toast.success("Medical record added!");
    } catch (error) {
      toast.error("Failed to add medical record.");
    }
  };

  const handleUpdatePoints = async (
    studentId: string,
    points: number,
    reason: string
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/students/${studentId}/points`,
        { points, reason }
      );
      setStudents(
        students.map((s) => (s.id === studentId ? response.data : s))
      );
      if (selectedStudent?.id === studentId) setSelectedStudent(response.data);
      toast.success("Points updated!");
      setNotifications([
        ...notifications,
        `Points updated for ${response.data.firstName} ${response.data.lastName}: ${reason}`,
      ]);
    } catch (error) {
      toast.error("Failed to update points.");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/students/${studentId}`
      );
      setStudents(students.filter((s) => s.id !== studentId));
      if (selectedStudent?.id === studentId) setShowStudentModal(false);
      toast.success("Student deleted!");
    } catch (error) {
      toast.error("Failed to delete student.");
    }
  };

  const fetchAttendanceReport = async (
    period: "daily" | "weekly" | "monthly"
  ) => {
    if (!selectedStudent) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/attendance-report`,
        { params: { period } }
      );
      setAttendanceReport(response.data);
    } catch (error) {
      toast.error("Failed to fetch attendance report.");
    }
  };

  const fetchSubjectAnalysis = async () => {
    if (!selectedStudent) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/subject-analysis`
      );
      setSubjectAnalysis(response.data);
    } catch (error) {
      toast.error("Failed to fetch subject analysis.");
    }
  };

  const fetchBehaviorTrends = async () => {
    if (!selectedStudent) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/${
          selectedStudent.id
        }/behavior-trends`
      );
      setBehaviorTrends(response.data);
    } catch (error) {
      toast.error("Failed to fetch behavior trends.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setFile(files[0]);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleHighContrast = () => setHighContrast(!highContrast);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const pieData = classStats
    ? {
        labels: ["S1", "S2", "S3", "S4", "S5", "S6"],
        datasets: [
          {
            data: [
              classStats.S1,
              classStats.S2,
              classStats.S3,
              classStats.S4,
              classStats.S5,
              classStats.S6,
            ],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
          },
        ],
      }
    : null;

  return (
    <>
      <Navbar
        bg={theme === "light" ? "light" : "dark"}
        variant={theme}
        expand="lg"
        className="mb-4 shadow-sm"
      >
        <Container>
          <Navbar.Brand
            style={{ color: theme === "light" ? "#1a2b4c" : "#e0e0e0" }}
          >
            School Dashboard
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="notifications">
                <FaBell size={20} />
                {notifications.length > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {notifications.length}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notifications.length === 0 ? (
                  <Dropdown.Item>No new notifications</Dropdown.Item>
                ) : (
                  notifications.map((note, idx) => (
                    <Dropdown.Item key={idx}>{note}</Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="link" onClick={toggleTheme}>
              {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
            </Button>
            <Button variant="link" onClick={toggleHighContrast}>
              {highContrast ? "Normal" : "High Contrast"}
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="px-4">
        <h2 className="text-center mb-4" style={{ color: "var(--text-color)" }}>
          School Management Dashboard
        </h2>

        <Tabs defaultActiveKey="home" className="mb-4" variant="pills" justify>
          <Tab eventKey="home" title="Home">
            <Row>
              <Col md={6}>
                <div className="card-custom">
                  <h5>Class Distribution</h5>
                  {pieData && <Pie data={pieData} />}
                </div>
              </Col>
              <Col md={6}>
                <div className="card-custom">
                  <h5>Recent Notifications</h5>
                  <ListGroup>
                    {notifications.slice(0, 5).map((note, idx) => (
                      <ListGroup.Item key={idx}>{note}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="overview" title="Class Overview">
            <Row>
              <Col md={3} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Class</Form.Label>
                  <Form.Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">-- Select Class --</option>
                    {["S1", "S2", "S3", "S4", "S5", "S6"].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Search Students</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search students"
                  />
                </Form.Group>
              </Col>
              <Col md={6} sm={12} className="d-flex align-items-end gap-3 mb-4">
                <Button
                  variant="primary"
                  onClick={fetchStudents}
                  disabled={!selectedClass}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Load Students"
                  )}
                </Button>
                <Button
                  variant="warning"
                  onClick={handleExportToExcel}
                  disabled={students.length === 0}
                >
                  Export Selected <FaFileExcel />
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    selectedStudents.length &&
                    axios.post(
                      `${
                        import.meta.env.VITE_BACKEND_URL
                      }/students/bulk-notify`,
                      { studentIds: selectedStudents }
                    )
                  }
                  disabled={selectedStudents.length === 0}
                >
                  Notify Parents
                </Button>
              </Col>
            </Row>

            {currentStudents.length > 0 && (
              <div className="card-custom table-custom">
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>
                        <Form.Check
                          type="checkbox"
                          onChange={(e) =>
                            setSelectedStudents(
                              e.target.checked
                                ? currentStudents.map((s) => s.id)
                                : []
                            )
                          }
                          checked={
                            selectedStudents.length ===
                              currentStudents.length &&
                            currentStudents.length > 0
                          }
                        />
                      </th>
                      <th>ID Number</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() =>
                              setSelectedStudents((prev) =>
                                prev.includes(student.id)
                                  ? prev.filter((id) => id !== student.id)
                                  : [...prev, student.id]
                              )
                            }
                          />
                        </td>
                        <td>{student.idNumber}</td>
                        <td>
                          {student.firstName} {student.lastName}
                        </td>
                        <td>{student.enrolledClass}</td>
                        <td>
                          <Badge bg="info">{student.points}</Badge>
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentModal(true);
                            }}
                          >
                            Details
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="ms-2"
                            onClick={() =>
                              handleUpdatePoints(
                                student.id,
                                student.points + 10,
                                "Good behavior"
                              )
                            }
                          >
                            +10
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Tab>

          <Tab eventKey="upload" title="Bulk Upload">
            <Row className="justify-content-center">
              <Col md={6}>
                <div className="card-custom">
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Student Data</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                      aria-label="Upload student data"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={handleFileUpload}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Upload Students"
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="admission" title="New Admission">
            <Row className="justify-content-center">
              <Col md={8}>
                <AdmissionForm onSubmit={handleAddStudent} />
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="class-reports" title="Class Reports">
            <Row>
              <Col md={12}>
                <div className="card-custom">
                  <h5>Class Statistics</h5>
                  {classStats && (
                    <>
                      <p>Average Attendance: {classStats.avgAttendance}%</p>
                      <p>Top Subject: {classStats.topSubject}</p>
                      <p>Total Incidents: {classStats.totalIncidents}</p>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Tab>
        </Tabs>

        <Modal
          show={showStudentModal}
          onHide={() => setShowStudentModal(false)}
          size="xl"
          centered
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Student Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedStudent && (
              <Row>
                <Col md={4}>
                  <StudentProfile student={selectedStudent} />
                  <CollapsibleSection title="Medical History">
                    <MedicalHistory
                      medicalRecords={selectedStudent.medicalHistory}
                      onAdd={handleAddMedicalRecord}
                    />
                  </CollapsibleSection>
                </Col>
                <Col md={8}>
                  <Tabs defaultActiveKey="attendance" variant="pills">
                    <Tab eventKey="attendance" title="Attendance">
                      <CollapsibleSection title="Attendance Management">
                        <AttendanceManagement
                          attendance={selectedStudent.attendance}
                          onAdd={handleAddAttendance}
                          report={attendanceReport}
                          onPeriodChange={fetchAttendanceReport}
                        />
                      </CollapsibleSection>
                    </Tab>
                    <Tab eventKey="incidents" title="Incidents">
                      <CollapsibleSection title="Incident Management">
                        <IncidentManagement
                          incidents={selectedStudent.incidents}
                          onAddIncident={handleAddIncident}
                          onNotifyParent={handleNotifyParent}
                          onUpdateStatus={handleUpdateIncidentStatus}
                        />
                        <BehaviorTrends trends={behaviorTrends} />
                      </CollapsibleSection>
                    </Tab>
                    <Tab eventKey="academics" title="Academic History">
                      <CollapsibleSection title="Academic Records">
                        <AcademicHistory
                          academicRecords={selectedStudent.academicHistory}
                          onAdd={handleAddAcademicRecord}
                          analysis={subjectAnalysis}
                        />
                      </CollapsibleSection>
                    </Tab>
                    <Tab eventKey="points" title="Points">
                      <CollapsibleSection title="Points Management">
                        <PointsManagement
                          student={selectedStudent}
                          onUpdate={handleUpdatePoints}
                        />
                      </CollapsibleSection>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            )}
          </Modal.Body>
        </Modal>

        <ToastContainer position="top-end" />
      </Container>
    </>
  );
};

// Admission Form Component
interface AdmissionFormProps {
  onSubmit: (
    data: Omit<
      Student,
      | "id"
      | "idNumber"
      | "points"
      | "incidents"
      | "attendance"
      | "academicHistory"
      | "medicalHistory"
    >
  ) => void;
}

const AdmissionForm = ({ onSubmit }: AdmissionFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    phoneNumber: "",
    enrolledClass: "",
    parentName: "",
    parentPhoneNumber: "",
    admissionDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (formData.age < 5 || formData.age > 25)
      newErrors.age = "Age must be between 5 and 25";
    if (!/^\d{3}-\d{4}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone must be in XXX-XXXX format";
    if (!formData.enrolledClass) newErrors.enrolledClass = "Class is required";
    if (!formData.parentName) newErrors.parentName = "Parent name is required";
    if (!/^\d{3}-\d{4}$/.test(formData.parentPhoneNumber))
      newErrors.parentPhoneNumber = "Phone must be in XXX-XXXX format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({
        firstName: "",
        lastName: "",
        age: 0,
        phoneNumber: "",
        enrolledClass: "",
        parentName: "",
        parentPhoneNumber: "",
        admissionDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="card-custom">
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            {errors.firstName && (
              <Form.Text className="text-danger">{errors.firstName}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
            {errors.lastName && (
              <Form.Text className="text-danger">{errors.lastName}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: parseInt(e.target.value) })
              }
              required
            />
            {errors.age && (
              <Form.Text className="text-danger">{errors.age}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
            {errors.phoneNumber && (
              <Form.Text className="text-danger">
                {errors.phoneNumber}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Class</Form.Label>
            <Form.Select
              value={formData.enrolledClass}
              onChange={(e) =>
                setFormData({ ...formData, enrolledClass: e.target.value })
              }
              required
            >
              <option value="">Select Class</option>
              {["S1", "S2", "S3", "S4", "S5", "S6"].map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </Form.Select>
            {errors.enrolledClass && (
              <Form.Text className="text-danger">
                {errors.enrolledClass}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Parent Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.parentName}
              onChange={(e) =>
                setFormData({ ...formData, parentName: e.target.value })
              }
              required
            />
            {errors.parentName && (
              <Form.Text className="text-danger">{errors.parentName}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Parent Phone</Form.Label>
            <Form.Control
              type="text"
              value={formData.parentPhoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, parentPhoneNumber: e.target.value })
              }
              required
            />
            {errors.parentPhoneNumber && (
              <Form.Text className="text-danger">
                {errors.parentPhoneNumber}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Button variant="warning" type="submit">
        Add Student
      </Button>
    </Form>
  );
};

// Attendance Management Component
interface AttendanceManagementProps {
  attendance: { date: string; status: "present" | "absent" | "late" }[];
  onAdd: (attendance: {
    date: string;
    status: "present" | "absent" | "late";
  }) => void;
  report: any;
  onPeriodChange: (period: "daily" | "weekly" | "monthly") => void;
}

const AttendanceManagement = ({
  attendance,
  onAdd,
  report,
  onPeriodChange,
}: AttendanceManagementProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    status: "present" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      status: "present",
    });
  };

  return (
    <div className="card-custom">
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="warning" type="submit">
          Add Attendance
        </Button>
      </Form>
      <AttendanceChart attendance={attendance} period="monthly" />
      {report && (
        <div className="mt-3">
          <Form.Select
            onChange={(e) => onPeriodChange(e.target.value as any)}
            className="mb-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Form.Select>
          <ListGroup>
            <ListGroup.Item>Total: {report.total}</ListGroup.Item>
            <ListGroup.Item>Present: {report.present}</ListGroup.Item>
            <ListGroup.Item>Absent: {report.absent}</ListGroup.Item>
            <ListGroup.Item>Late: {report.late}</ListGroup.Item>
          </ListGroup>
        </div>
      )}
    </div>
  );
};

// Academic History Component
interface AcademicHistoryProps {
  academicRecords: AcademicRecord[];
  onAdd: (record: AcademicRecord) => void;
  analysis: any[];
}

const AcademicHistory = ({
  academicRecords,
  onAdd,
  analysis,
}: AcademicHistoryProps) => {
  const [formData, setFormData] = useState({
    subject: "",
    grade: 0,
    semester: "",
    year: new Date().getFullYear(),
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (formData.grade < 0 || formData.grade > 100)
      newErrors.grade = "Grade must be between 0 and 100";
    if (!formData.semester) newErrors.semester = "Semester is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      setFormData({
        subject: "",
        grade: 0,
        semester: "",
        year: new Date().getFullYear(),
      });
    }
  };

  return (
    <div className="card-custom">
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
              {errors.subject && (
                <Form.Text className="text-danger">{errors.subject}</Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Grade</Form.Label>
              <Form.Control
                type="number"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: parseInt(e.target.value) })
                }
                required
                min={0}
                max={100}
              />
              {errors.grade && (
                <Form.Text className="text-danger">{errors.grade}</Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control
                type="text"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                required
              />
              {errors.semester && (
                <Form.Text className="text-danger">{errors.semester}</Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="warning" type="submit">
          Add Record
        </Button>
      </Form>
      <ListGroup className="mb-3">
        {academicRecords.map((record) => (
          <ListGroup.Item key={`${record.subject}-${record.semester}`}>
            {record.subject} - {record.grade}% ({record.semester} {record.year})
          </ListGroup.Item>
        ))}
      </ListGroup>
      {analysis.length > 0 && (
        <div>
          <h6>Subject Analysis</h6>
          <ListGroup>
            {analysis.map((item) => (
              <ListGroup.Item key={item.subject}>
                {item.subject}: {item.average.toFixed(2)}% - {item.strength}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

// Medical History Component
interface MedicalHistoryProps {
  medicalRecords: MedicalRecord[];
  onAdd: (record: Omit<MedicalRecord, "id">) => void;
}

const MedicalHistory = ({ medicalRecords, onAdd }: MedicalHistoryProps) => {
  const [formData, setFormData] = useState({
    condition: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    emergencyLevel: "low" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      condition: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      emergencyLevel: "low",
    });
  };

  return (
    <div className="card-custom">
      <Form onSubmit={handleSubmit} className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                type="text"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Level</Form.Label>
              <Form.Select
                value={formData.emergencyLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyLevel: e.target.value as any,
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button variant="warning" type="submit">
          Add Medical Record
        </Button>
      </Form>
      <ListGroup>
        {medicalRecords.map((record) => (
          <ListGroup.Item key={record.id}>
            {record.condition} - {new Date(record.date).toLocaleDateString()}
            <Badge
              bg={record.emergencyLevel === "high" ? "danger" : "warning"}
              className="ms-2"
            >
              {record.emergencyLevel}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

// Points Management Component
interface PointsManagementProps {
  student: Student;
  onUpdate: (studentId: string, points: number, reason: string) => void;
}

const PointsManagement = ({ student, onUpdate }: PointsManagementProps) => {
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(student.id, points, reason);
    setPoints(0);
    setReason("");
  };

  return (
    <div className="card-custom">
      <h5>Current Points: {student.points}</h5>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Points Adjustment</Form.Label>
          <Form.Control
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="warning" type="submit">
          Update Points
        </Button>
      </Form>
    </div>
  );
};

// Behavior Trends Component
const BehaviorTrends = ({ trends }: { trends: any[] }) => (
  <div className="card-custom mt-3">
    <h5>Behavior Trends</h5>
    <ListGroup>
      {trends.map((trend) => (
        <ListGroup.Item key={trend.month}>
          {trend.month}: {trend.incidentCount} incidents, Avg Severity:{" "}
          {trend.averageSeverity.toFixed(2)}
          <Badge
            bg={trend.prediction === "High risk" ? "danger" : "success"}
            className="ms-2"
          >
            {trend.prediction}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

// Collapsible Section Component
const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div
        className="collapsible-header d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h5 className="mb-0">{title}</h5>
        {isOpen ? <FaMinus /> : <FaPlus />}
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </>
  );
};

export default StudentDashboard;
