import { Card, Badge, ListGroup } from "react-bootstrap";
import { Student } from "../../types/Student";

interface StudentProfileProps {
  student: Student;
}

const StudentProfile = ({ student }: StudentProfileProps) => {
  return (
    <Card className="card-custom mb-4">
      <Card.Header className="bg-dark text-white">
        <h4>
          {student.firstName} {student.lastName}
        </h4>
        <Badge bg="warning" text="dark">
          ID: {student.idNumber}
        </Badge>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>Class: {student.enrolledClass}</ListGroup.Item>
          <ListGroup.Item>Age: {student.age}</ListGroup.Item>
          <ListGroup.Item>Phone: {student.phoneNumber}</ListGroup.Item>
          <ListGroup.Item>Parent: {student.parentName}</ListGroup.Item>
          <ListGroup.Item>
            Parent Phone: {student.parentPhoneNumber}
          </ListGroup.Item>
          <ListGroup.Item>
            Points: <Badge bg="info">{student.points}</Badge>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default StudentProfile;
