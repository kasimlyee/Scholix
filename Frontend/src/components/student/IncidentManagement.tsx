import { useState } from "react";
import { Form, Button, Table, Badge } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { Incident } from "../../types/Student";

interface IncidentManagementProps {
  incidents: Incident[];
  onAddIncident: (incident: Incident) => void;
  onNotifyParent: (incidentId: string) => void;
  onUpdateStatus: (incidentId: string, status: Incident["status"]) => void;
}

const IncidentManagement = ({
  incidents,
  onAddIncident,
  onNotifyParent,
  onUpdateStatus,
}: IncidentManagementProps) => {
  const [newIncident, setNewIncident] = useState({
    type: "behavioral" as const,
    description: "",
    severity: "medium" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incident: Incident = {
      id: crypto.randomUUID(),
      ...newIncident,
      date: new Date().toISOString(),
      status: "pending",
    };
    onAddIncident(incident);
    setNewIncident({ type: "behavioral", description: "", severity: "medium" });
  };

  return (
    <div className="card-custom p-4 mb-4">
      <h5 className="d-flex align-items-center gap-2">
        <FaExclamationTriangle className="text-warning" /> Incident Management
      </h5>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
            name="type"
            value={newIncident.type}
            onChange={(e) =>
              setNewIncident({ ...newIncident, type: e.target.value as any })
            }
          >
            <option value="behavioral">Behavioral</option>
            <option value="academic">Academic</option>
            <option value="safety">Safety</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Severity</Form.Label>
          <Form.Select
            name="severity"
            value={newIncident.severity}
            onChange={(e) =>
              setNewIncident({
                ...newIncident,
                severity: e.target.value as any,
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={newIncident.description}
            onChange={(e) =>
              setNewIncident({ ...newIncident, description: e.target.value })
            }
          />
        </Form.Group>
        <Button variant="warning" type="submit">
          Submit Incident
        </Button>
      </Form>

      <Table striped hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{new Date(incident.date).toLocaleDateString()}</td>
              <td>{incident.type}</td>
              <td>
                <Badge bg={incident.severity === "high" ? "danger" : "warning"}>
                  {incident.severity}
                </Badge>
              </td>
              <td>{incident.description}</td>
              <td>
                <Form.Select
                  size="sm"
                  value={incident.status}
                  onChange={(e) =>
                    onUpdateStatus(
                      incident.id,
                      e.target.value as Incident["status"]
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </Form.Select>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => onNotifyParent(incident.id)}
                >
                  Notify Parent
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default IncidentManagement;
