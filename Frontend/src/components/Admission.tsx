import React, { useState } from "react";
import { Button, Form, Modal, Carousel } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../theme.css";
import axios from "axios";

export interface Student {
  idNumber: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phoneNumber: string;
  enrolledClass: string;
  parentName: string;
  parentPhoneNumner: string;
  parentEmail: string;
  address: string;
}
interface AdmissionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const Admission: React.FC<AdmissionProps> = ({ showModal, setShowModal }) => {
  const [message, setMessage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [newStudent, setNewStudent] = useState<Student>({
    idNumber: "",
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
    phoneNumber: "",
    enrolledClass: "",
    parentName: "",
    parentPhoneNumner: "",
    parentEmail: "",
    address: "",
  });

  const handleRegisterStudent = async () => {
    try {
      await axios.post("http://localhost:3000/api/students", newStudent);
      setMessage("✅ Student added successfully.");
      console.log(newStudent);
      setShowModal(false);
      //fetchStudents();
    } catch (error) {
      console.error("Add Student error:", error);
      console.log(newStudent);
      setMessage("❌ Failed to add student.");
    }
  };
  // 📌 Move to Next Step
  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, 2)); // Max 2 slides
  };

  // 📌 Move to Previous Step
  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0)); // Min 0 slides
  };
  return (
    <div>
      {/* 📌 Add Student Modal with Carousel */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            activeIndex={currentSlide}
            controls={false}
            indicators={false}
          >
            {/* Step 1: Student Details */}
            <Carousel.Item>
              <h5>Student Details</h5>
              <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.firstName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, firstName: e.target.value })
                  }
                />
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.lastName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>ID:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.idNumber}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      idNumber: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Age:</Form.Label>
                <Form.Control
                  type="number"
                  value={newStudent.age}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      age: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Class:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.enrolledClass}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      enrolledClass: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <div className="d-flex justify-content-between mt-3">
                <Button variant="primary" onClick={nextSlide}>
                  Next <FaArrowRight />
                </Button>
              </div>
            </Carousel.Item>

            {/* Step 2: Location Details */}
            <Carousel.Item>
              <h5>Contact</h5>
              <Form.Group>
                <Form.Label>Location:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.address}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, address: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.phoneNumber}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      email: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={prevSlide}>
                  <FaArrowLeft /> Back
                </Button>
                <Button variant="primary" onClick={nextSlide}>
                  Next <FaArrowRight />
                </Button>
              </div>
            </Carousel.Item>

            {/* Step 3: Parent/Guardian Details */}
            <Carousel.Item>
              <h5>Parents/Guardian Details</h5>
              <Form.Group>
                <Form.Label>Parent's Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.parentName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, parentName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Father's Contact:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.parentPhoneNumner}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      parentPhoneNumner: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Parent's Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={newStudent.parentEmail}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      parentEmail: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={prevSlide}>
                  <FaArrowLeft /> Back
                </Button>
                <Button variant="success" onClick={handleRegisterStudent}>
                  Submit
                </Button>
              </div>
            </Carousel.Item>
          </Carousel>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Admission;
