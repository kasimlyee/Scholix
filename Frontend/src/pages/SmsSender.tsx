import { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Alert, Dropdown, Badge, Modal, Table } from 'react-bootstrap';
import { Moon, Sun, Clock, Calendar, Download } from 'react-bootstrap-icons';
import styled, { DefaultTheme } from 'styled-components';
import {sendSMS} from '../services/NotificationService'

// Define theme interface
interface Theme extends DefaultTheme {
  mode: 'light' | 'dark';
}

// Styled Components with proper typing
const ThemedContainer = styled(Container)<{ theme: Theme }>`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.mode === 'dark' ? '#1a1a1a' : '#fff'};
  color: ${({ theme }) => theme.mode === 'dark' ? '#fff' : '#000'};
  transition: all 0.3s ease;
`;

const ThemedCard = styled(Card)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.mode === 'dark' ? '#2d2d2d' : '#fff'};
  border-color: ${({ theme }) => theme.mode === 'dark' ? '#404040' : '#ddd'};
`;

// Types
interface Student {
  id: number;
  name: string;
  parentPhone: string;
}

interface Class {
  id: number;
  name: string;
  students: Student[];
}

interface MessageHistory {
  id: number;
  recipient: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'failed' | 'pending' | 'delivered';
  scheduledTime?: string;
}

interface Template {
  id: number;
  name: string;
  content: string;
}

interface ContactGroup {
  id: number;
  name: string;
  members: string[];
}

const SmsSender: React.FC = () => {
  const [theme, setTheme] = useState<Theme>({ mode: 'light' });
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [customNumbers, setCustomNumbers] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [history, setHistory] = useState<MessageHistory[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [scheduleTime, setScheduleTime] = useState<string>('');

  useEffect(() => {
    const sampleClasses: Class[] = [
      {
        id: 1,
        name: 'Class 1A',
        students: [
          { id: 1, name: 'Alice', parentPhone: '+1234567890' },
          { id: 2, name: 'Bob', parentPhone: '+1234567891' },
        ],
      },
      {
        id: 2,
        name: 'Class 1B',
        students: [
          { id: 3, name: 'Charlie', parentPhone: '+1234567892' },
        ],
      },
    ];

    const sampleTemplates: Template[] = [
      { id: 1, name: 'Absence Notification', content: 'Dear parent, your child is absent today.' },
      { id: 2, name: 'Meeting Reminder', content: 'Reminder: Parent-teacher meeting tomorrow at 3 PM.' },
    ];

    const sampleGroups: ContactGroup[] = [
      { id: 1, name: 'Parents Group', members: ['+1234567890', '+1234567891'] }
    ];
    
    setClasses(sampleClasses);
    setTemplates(sampleTemplates);
    setGroups(sampleGroups);
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme({ mode: savedTheme });
  }, []);

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme({ mode: newMode });
    localStorage.setItem('theme', newMode);
  };

  const handleBulkSend = async (e: React.FormEvent, isScheduled = false) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus('Please enter a message');
      return;
    }

    try {
      const recipients: string[] = [];
      
      if (selectedClass && selectedStudents.length) {
        const classData = classes.find(c => c.id === selectedClass);
        recipients.push(...(classData?.students
          .filter(s => selectedStudents.includes(s.id))
          .map(s => s.parentPhone) || []));
      }

      if (customNumbers) {
        recipients.push(...customNumbers.split(',').map(num => num.trim()));
      }

      if (selectedGroup) {
        const group = groups.find(g => g.id === selectedGroup);
        recipients.push(...(group?.members || []));
      }

      if (!recipients.length) {
        setStatus('Please select recipients');
        return;
      }
      setStatus('Sending messages.....')

      const timestamp = new Date().toISOString();
      const newHistory: MessageHistory[] = []
      for (const recipient of recipients) {
        const sendStatus = await sendSMS(recipient, message);
         newHistory.push(
          {id: Date.now(),recipient,message,timestamp: new Date().toISOString(),status:sendStatus}
        );
      }

      

      setHistory(prev => [...newHistory, ...prev]);
      setStatus(`Messages ${isScheduled ? 'scheduled' : 'sent'} to ${recipients.length} recipients`);
      resetForm();
    } catch (error) {
      setStatus('Error processing messages');
    }
  };

  const exportHistory = () => {
    const csvContent = [
      'Recipient,Message,Time,Status,Scheduled Time',
      ...history.map(entry => 
        `"${entry.recipient}","${entry.message.replace(/"/g, '""')}",${entry.timestamp},${entry.status},${entry.scheduledTime || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'message_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setMessage('');
    setCustomNumbers('');
    setSelectedStudents([]);
    setSelectedGroup(null);
    setScheduleTime('');
    setCharCount(0);
  };

  return (
    <ThemedContainer theme={theme} className="py-4">
      <ThemedCard theme={theme}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>SMS Communication System</h3>
          <Button variant="outline-secondary" onClick={toggleTheme}>
            {theme.mode === 'light' ? <Moon /> : <Sun />}
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleBulkSend}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Select Class</Form.Label>
                  <Form.Select
                    value={selectedClass || ''}
                    onChange={(e) => {
                      setSelectedClass(parseInt(e.target.value) || null);
                      setSelectedStudents([]);
                    }}
                  >
                    <option value="">Select a class</option>
                    {classes.map(classItem => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                  </Form.Select>
                  {selectedClass && (
                    <div className="mt-2">
                      {classes.find(c => c.id === selectedClass)?.students.map(student => (
                        <Form.Check
                          key={student.id}
                          type="checkbox"
                          label={`${student.name} (${student.parentPhone})`}
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => setSelectedStudents(prev =>
                            prev.includes(student.id)
                              ? prev.filter(id => id !== student.id)
                              : [...prev, student.id]
                          )}
                        />
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Groups</Form.Label>
                  <Form.Select
                    value={selectedGroup || ''}
                    onChange={(e) => setSelectedGroup(parseInt(e.target.value) || null)}
                  >
                    <option value="">Select a group</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name} ({group.members.length} members)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Custom Numbers</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Numbers separated by commas"
                    value={customNumbers}
                    onChange={(e) => setCustomNumbers(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <div className="d-flex justify-content-between">
                    <Form.Label>Message (max 160)</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        Templates
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {templates.map(template => (
                          <Dropdown.Item 
                            key={template.id}
                            onClick={() => {
                              setMessage(template.content);
                              setCharCount(template.content.length);
                            }}
                          >
                            {template.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      const text = e.target.value;
                      setMessage(text);
                      setCharCount(text.length);
                    }}
                    maxLength={160}
                    className={theme.mode === 'dark' ? 'bg-dark text-white' : ''}
                  />
                  <Form.Text className={charCount > 140 ? 'text-danger' : 'text-muted'}>
                    {charCount}/160 characters
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Schedule (optional)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={!message.trim() || (!selectedStudents.length && !customNumbers && !selectedGroup)}
              >
                Send Now
              </Button>
              <Button
                variant="outline-primary"
                onClick={(e) => handleBulkSend(e, true)}
                disabled={!message.trim() || !scheduleTime}
              >
                <Calendar /> Schedule
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowPreview(true)}
              >
                Preview
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowHistory(true)}
              >
                <Clock /> History
              </Button>
            </div>

            {status && (
              <Alert variant={status.includes('Error') ? 'danger' : 'success'} className="mt-3">
                {status}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </ThemedCard>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} data-bs-theme={theme.mode}>
        <Modal.Header closeButton>
          <Modal.Title>Message Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Message:</strong> {message}</p>
          <p><strong>Characters:</strong> {charCount}/160</p>
          <p><strong>Recipients:</strong> {
            (selectedStudents.length + (customNumbers.split(',').filter(n => n.trim()).length) + 
            (selectedGroup ? groups.find(g => g.id === selectedGroup)?.members.length || 0:(0)))
            }</p>
          {scheduleTime && <p><strong>Scheduled:</strong> {new Date(scheduleTime).toLocaleString()}</p>}
        </Modal.Body>
      </Modal>

      <Modal show={showHistory} onHide={() => setShowHistory(false)} data-bs-theme={theme.mode} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Message History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {history.length === 0 ? (
            <p>No messages sent yet</p>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={exportHistory} className="mb-3">
                <Download /> Export CSV
              </Button>
              <Table striped bordered hover variant={theme.mode}>
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Message</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Scheduled</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(entry => (
                    <tr key={entry.id}>
                      <td>{entry.recipient}</td>
                      <td>{entry.message}</td>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
                      <td>
                        <Badge bg={
                          entry.status === 'sent' ? 'success' :
                          entry.status === 'failed' ? 'danger' :
                          entry.status === 'delivered' ? 'info' : 'warning'
                        }>
                          {entry.status}
                        </Badge>
                      </td>
                      <td>{entry.scheduledTime ? new Date(entry.scheduledTime).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </ThemedContainer>
  );
};

export default SmsSender;