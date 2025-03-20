import React from "react";
import { Modal } from "react-bootstrap";

import { Student } from "./Admission"; // Import your existing Student type

// Pick only the required fields from the Student type
type StudentModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  student?: Pick<
    Student,
    "idNumber" | "firstName" | "lastName" | "enrolledClass"
  >; // Only selected fields
};

const StudentModel: React.FC<StudentModalProps> = ({
  showModal,
  setShowModal,
  student,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Student Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {student ? (
          <div className="container-fluid">
            <div className="row">
              {/* Left Column (Details) */}
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Id Number:</strong> {student.idNumber}
                </div>
                <div className="mb-3">
                  <strong>Name:</strong> {student.firstName} {student.lastName}
                </div>
                <div className="mb-3">
                  <strong>Class:</strong> {student.enrolledClass}
                </div>
              </div>

              {/* Right Column (Image) */}
              <div className="col-md-6 text-center">
                <label className="form-label d-block">
                  <strong>Profile Picture</strong>
                </label>
                <div
                  className="border p-3 rounded d-flex justify-content-center align-items-center"
                  style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                >
                  <img
                    src={"https://via.placeholder.com/150"}
                    className="rounded-circle img-fluid"
                    style={{ maxHeight: "150px" }}
                    alt="Profile"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading student data...</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default StudentModel;
