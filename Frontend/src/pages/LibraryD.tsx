import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Alert,
  InputGroup,
  FormControl,
  Navbar,
  Nav,
  Dropdown,
  Modal,
  Badge,
  ProgressBar,
  ListGroup,
  Form,
  Image,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  FaBook,
  FaUser,
  FaExclamationTriangle,
  FaFileAlt,
  FaSearch,
  FaPlus,
  FaChartLine,
  FaFilter,
  FaDownload,
  FaBell,
  FaTimes,
  FaMoon,
  FaSun,
  FaUpload,
  FaBarcode,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
);

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  publishedYear: number;
  coverImage?: string;
  barcode?: string;
  genre?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  membershipDate: string;
  booksBorrowed: number;
  barcode?: string;
  phone?: string;
}

interface Transaction {
  id: number;
  userId: number;
  bookId: number;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Returned" | "Overdue" | "Borrowed";
  fineAmount?: number;
}

const LibraryD = () => {
  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]); // Added state
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueBookModal, setShowIssueBookModal] = useState(false);
  const [showReturnBookModal, setShowReturnBookModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [toasts, setToasts] = useState<any[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [returnBarcode, setReturnBarcode] = useState("");
  const [reportConfig, setReportConfig] = useState({
    type: "monthly",
    format: "pdf",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loadingReport, setLoadingReport] = useState(false);

  // Theme Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light");
    }
  }, [darkMode]);

  // Mock Data Initialization
  useEffect(() => {
    const initialBooks: Book[] = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        copies: 10,
        available: 8,
        publishedYear: 1925,
        coverImage: "https://via.placeholder.com/100x150",
        barcode: "123456789",
      },
    ];

    const initialUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        membershipDate: "2023-01-15",
        booksBorrowed: 2,
        barcode: "987654321",
      },
    ];

    const initialTransactions: Transaction[] = [
      {
        id: 1,
        userId: 1,
        bookId: 1,
        issueDate: "2023-03-01",
        dueDate: "2023-03-15",
        status: "Borrowed",
      },
    ];

    setBooks(initialBooks);
    setUsers(initialUsers);
    setTransactions(initialTransactions);
    setFilteredBooks(initialBooks); // Initialize filteredBooks
  }, []);

  // Chart Config
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Borrowings",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: darkMode ? "#20c997" : "#0d6efd",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Borrowings",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Borrowings",
        },
      },
    },
  };

  const popularBooksData = {
    labels: books.map((b) => b.title),
    datasets: [
      {
        label: "Borrow Count",
        data: books.map(
          (b) => transactions.filter((t) => t.bookId === b.id).length
        ),
        backgroundColor: darkMode ? "#20c997" : "#0d6efd",
      },
    ],
  };

  //Report Generation
  const generateReport = async () => {
    setLoadingReport(true);

    setTimeout(() => {
      const blob = new Blob(["Report Content"], { type: "text/plain" });
      saveAs(blob, `library-report-${Date.now()}.${reportConfig.format}`);
      setLoadingReport(false);
      setShowReportModal(false);
    }, 2000);
  };

  // Handlers
  const handleAddBook = () => {
    const book: Book = {
      id: books.length + 1,
      title: newBook.title || "New Book",
      author: newBook.author || "Unknown Author",
      isbn: newBook.isbn || "000-0000000000",
      copies: newBook.copies || 10,
      available: newBook.available || 10,
      publishedYear: newBook.publishedYear || 2023,
      coverImage: previewImage || undefined,
    };
    setBooks([...books, book]);
    setFilteredBooks([...books, book]);
    setShowAddBookModal(false);
    setNewBook({});
    setPreviewImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Removed file property from newBook
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredBooks(
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.includes(query)
      )
    );
  };

  const handleIssueBook = () => {
    if (!selectedUser || !selectedBook) return;

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      userId: selectedUser.id,
      bookId: selectedBook.id,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      status: "Borrowed",
    };

    setTransactions([...transactions, newTransaction]);
    setBooks(
      books.map((b) =>
        b.id === selectedBook.id ? { ...b, available: b.available - 1 } : b
      )
    );
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, booksBorrowed: u.booksBorrowed + 1 }
          : u
      )
    );
    setShowIssueBookModal(false);
    showToast("Book issued successfully!", "success");
  };

  const handleReturnBook = () => {
    const transaction = transactions.find(
      (t) => t.bookId.toString() === returnBarcode
    );
    if (!transaction) return;

    const updatedTransactions = transactions.map((t) =>
      t.id === transaction.id
        ? {
            ...t,
            status: "Returned" as "Returned",
            returnDate: new Date().toISOString(),
          }
        : t
    );

    setTransactions(updatedTransactions);
    setBooks(
      books.map((b) =>
        b.id === transaction.bookId ? { ...b, available: b.available + 1 } : b
      )
    );
    setShowReturnBookModal(false);
    showToast("Book returned successfully!", "success");
  };

  const showToast = (message: string, variant: string) => {
    setToasts([...toasts, { id: Date.now(), message, variant }]);
  };

  return (
    <div
      className={darkMode ? "bg-dark text-light" : ""}
      style={{ minHeight: "100vh" }}
    >
      <Navbar
        bg={darkMode ? "bg-dark text-light" : ""}
        style={{ minHeight: "100vh" }}
      >
        <ToastContainer position="top-end" className="p-3">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              onClose={() => setToasts(toasts.filter((t) => t.id !== toast.id))} // Fixed onClose prop
              bg={darkMode ? "dark" : "light"}
              delay={3000}
              autohide
            >
              <Toast.Header
                closeButton={!darkMode}
                closeVariant={darkMode ? "white" : undefined}
              >
                <strong className="me-auto">Notification</strong>
              </Toast.Header>
              <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
        <Container fluid>
          <Navbar.Brand>
            <FaBook className="me-2" />
            Library Management System
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Button
                variant="success"
                className="me-2"
                onClick={() => setShowIssueBookModal(true)}
              >
                <FaBook className="me-2" />
                Issue Book
              </Button>
              <Button
                variant="warning"
                onClick={() => setShowReturnBookModal(true)}
              >
                <FaBook className="me-2" />
                Return Book
              </Button>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <InputGroup className="mt-2 mb-2">
                <FormControl
                  placeholder="Search books, users..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={darkMode ? "bg-dark text-light" : ""}
                />
                <Button variant={darkMode ? "outline-light" : "outline-dark"}>
                  <FaSearch />
                </Button>
              </InputGroup>
            </Nav>

            <Nav>
              <Button
                variant={darkMode ? "light" : "dark"}
                className="me-3"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>

              <Dropdown className="me-3">
                <Dropdown.Toggle variant={darkMode ? "light" : "dark"}>
                  <FaBell />
                  <Badge pill bg="danger" className="ms-1">
                    3
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu variant={darkMode ? "dark" : "light"}>
                  <Dropdown.Header>Notifications</Dropdown.Header>
                  <Dropdown.Item>
                    <Alert variant="warning" className="mb-0">
                      3 books overdue
                    </Alert>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="mt-4">
        {/* Quick Stats */}
        <Row className="g-4 mb-4">
          {[
            {
              title: "Total Books",
              value: books.length,
              icon: <FaBook />,
              color: "primary",
            },
            {
              title: "Active Users",
              value: users.length,
              icon: <FaUser />,
              color: "success",
            },
            {
              title: "Transactions",
              value: transactions.length,
              icon: <FaFileAlt />,
              color: "warning",
            },
            {
              title: "Overdue",
              value: transactions.filter((t) => t.status === "Overdue").length,
              icon: <FaExclamationTriangle />,
              color: "danger",
            },
          ].map((stat, idx) => (
            <Col key={idx} xs={12} sm={6} lg={3}>
              <Card
                className={`h-100 shadow-sm bg-${
                  darkMode ? "secondary text-light" : "light"
                }`}
              >
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className={`bg-${stat.color} p-3 rounded me-3`}>
                      {stat.icon}
                    </div>
                    <div>
                      <h5 className="mb-0">{stat.title}</h5>
                      <h2 className="mb-0">{stat.value}</h2>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Management Sections */}
        <Row className="g-4 mt-4">
          <Col xl={8}>
            {/* Book Management */}
            <Card
              className={`mt-4 shadow-sm ${
                darkMode ? "bg-secondary text-light" : ""
              }`}
            >
              <Card.Header
                className={`d-flex justify-content-between align-items-center ${
                  darkMode ? "bg-dark" : "bg-light"
                }`}
              >
                <h5 className="mb-0">
                  <FaBook className="me-2" />
                  Book Management
                </h5>
                <div>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => setShowAddBookModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Add Book
                  </Button>
                  <Button variant={darkMode ? "outline-light" : "outline-dark"}>
                    <FaDownload className="me-2" />
                    Export
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Available</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book) => (
                        <tr key={book.id}>
                          <td>
                            {book.coverImage && (
                              <Image
                                src={book.coverImage}
                                alt="Cover"
                                thumbnail
                                style={{ width: "60px" }}
                              />
                            )}
                          </td>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>
                            <ProgressBar
                              now={(book.available / book.copies) * 100}
                              label={`${book.available}/${book.copies}`}
                              variant={
                                book.available / book.copies > 0.5
                                  ? "success"
                                  : "danger"
                              }
                            />
                          </td>
                          <td>
                            <Button variant="info" size="sm" className="me-2">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={8}>
            {/* Borrowing Trends */}
            <Card
              className={`shadow-sm ${
                darkMode ? "bg-secondary text-light" : ""
              }`}
            >
              <Card.Header
                className={`d-flex justify-content-between align-items-center ${
                  darkMode ? "bg-dark" : "bg-light"
                }`}
              >
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Borrowing Trends
                </h5>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={darkMode ? "outline-light" : "outline-dark"}
                  >
                    <FaFilter className="me-2" /> Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant={darkMode ? "dark" : "light"}>
                    <Dropdown.Item>Last 7 days</Dropdown.Item>
                    <Dropdown.Item>Last 30 days</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>
              <Card.Body style={{ height: "300px" }}>
                <Line data={chartData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xl={4}>
            {/* Recent Users */}
            <Card
              className={`shadow-sm ${
                darkMode ? "bg-secondary text-light" : ""
              }`}
            >
              <Card.Header className={darkMode ? "bg-dark" : "bg-light"}>
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Recent Users
                </h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {users.map((user) => (
                    <ListGroup.Item
                      key={user.id}
                      className={darkMode ? "bg-secondary text-light" : ""}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                        <Badge pill bg="info">
                          {user.booksBorrowed}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Overdue Books */}
            <Card
              className={`mt-4 shadow-sm ${
                darkMode ? "bg-secondary text-light" : ""
              }`}
            >
              <Card.Header className={darkMode ? "bg-dark" : "bg-light"}>
                <h5 className="mb-0">
                  <FaExclamationTriangle className="me-2" />
                  Overdue Books
                </h5>
              </Card.Header>
              <Card.Body>
                {transactions
                  .filter((t) => t.status === "Overdue")
                  .map((transaction) => (
                    <Alert
                      key={transaction.id}
                      variant="danger"
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{transaction.bookId}</strong>
                        <div>
                          <small>Due: {transaction.dueDate}</small>
                        </div>
                      </div>
                      <FaTimes className="cursor-pointer" />
                    </Alert>
                  ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Issue Book Modal */}
      <Modal
        show={showIssueBookModal}
        onHide={() => setShowIssueBookModal(false)}
        contentClassName={darkMode ? "bg-dark text-light" : ""}
        size="lg"
      >
        <Modal.Header closeButton closeVariant={darkMode ? "white" : undefined}>
          <Modal.Title>Issue Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h5>Scan User Barcode</h5>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Enter user barcode"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <FaBarcode />
                </Button>
              </InputGroup>
              {selectedUser && (
                <Card className="mb-3">
                  <Card.Body>
                    <h5>{selectedUser.name}</h5>
                    <p className="mb-0">Email: {selectedUser.email}</p>
                    <p className="mb-0">
                      Books Borrowed: {selectedUser.booksBorrowed}
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>

            <Col md={6}>
              <h5>Scan Book Barcode</h5>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Enter book barcode"
                  value={barcodeInput}
                  onChange={(e) => {
                    const book = books.find(
                      (b) => b.barcode === e.target.value
                    );
                    if (book) setSelectedBook(book);
                  }}
                />
                <Button variant="outline-secondary">
                  <FaBarcode />
                </Button>
              </InputGroup>
              {selectedBook && (
                <Card className="mb-3">
                  <Card.Body>
                    <h5>{selectedBook.title}</h5>
                    <p className="mb-0">Author: {selectedBook.author}</p>
                    <p className="mb-0">Available: {selectedBook.available}</p>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          <div className="mt-3">
            <h5>Due Date</h5>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => date && setDueDate(date)}
              minDate={new Date()}
              className="form-control"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowIssueBookModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleIssueBook}>
            Confirm Issue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Return Book Modal */}
      <Modal
        show={showReturnBookModal}
        onHide={() => setShowReturnBookModal(false)}
        contentClassName={darkMode ? "bg-dark text-light" : ""}
      >
        <Modal.Header closeButton closeVariant={darkMode ? "white" : undefined}>
          <Modal.Title>Return Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Scan book barcode"
              value={returnBarcode}
              onChange={(e) => setReturnBarcode(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaBarcode />
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowReturnBookModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReturnBook}>
            Confirm Return
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Statistics Section */}
      <Container fluid className="mt-4">
        <Row className="g-4">
          <Col xl={4}>
            <Card
              className={`shadow-sm ${
                darkMode ? "bg-secondary text-light" : ""
              }`}
            >
              <Card.Header className={darkMode ? "bg-dark" : "bg-light"}>
                <h5>
                  <FaChartLine className="me-2" />
                  Popular Books
                </h5>
              </Card.Header>
              <Card.Body style={{ height: "300px" }}>
                <Bar
                  data={popularBooksData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: true, text: "Most Borrowed Books" },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={8}>
            <Card
              className={`shadow-sm ${
                darkMode ? "bg-secondary text-light" : ""
              }`}
            >
              <Card.Header className={darkMode ? "bg-dark" : "bg-light"}>
                <h5>
                  <FaCalendarAlt className="me-2" />
                  Due Date Calendar
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="due-date-grid">
                  {[...Array(30)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return (
                      <div key={i} className="due-date-cell">
                        <div className="due-date-header">
                          {date.toLocaleDateString()}
                        </div>
                        <div className="due-date-count">
                          {
                            transactions.filter(
                              (t) =>
                                new Date(t.dueDate).toDateString() ===
                                date.toDateString()
                            ).length
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Enhanced Transactions Section */}
      <Container fluid className="mt-4">
        <Card
          className={`shadow-sm ${darkMode ? "bg-secondary text-light" : ""}`}
        >
          <Card.Header
            className={`d-flex justify-content-between align-items-center ${
              darkMode ? "bg-dark" : "bg-light"
            }`}
          >
            <h5>
              <FaFileAlt className="me-2" />
              Transaction History
            </h5>
            <div>
              <Button variant="outline-secondary" className="me-2">
                <FaDownload /> Export CSV
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  <FaFilter /> Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>All</Dropdown.Item>
                  <Dropdown.Item>Borrowed</Dropdown.Item>
                  <Dropdown.Item>Overdue</Dropdown.Item>
                  <Dropdown.Item>Returned</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book</th>
                    <th>Issued Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => {
                    const user = users.find((u) => u.id === t.userId);
                    const book = books.find((b) => b.id === t.bookId);
                    return (
                      <tr key={t.id}>
                        <td>{user?.name}</td>
                        <td>{book?.title}</td>
                        <td>{t.issueDate}</td>
                        <td>{t.dueDate}</td>
                        <td>{t.returnDate || "-"}</td>
                        <td>
                          <Badge
                            bg={
                              t.status === "Borrowed"
                                ? "primary"
                                : t.status === "Overdue"
                                ? "danger"
                                : "success"
                            }
                          >
                            {t.status}
                          </Badge>
                        </td>
                        <td>${t.fineAmount || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Add Book Modal */}
      <Modal
        show={showAddBookModal}
        onHide={() => setShowAddBookModal(false)}
        contentClassName={darkMode ? "bg-dark text-light" : ""}
      >
        <Modal.Header closeButton closeVariant={darkMode ? "white" : undefined}>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  thumbnail
                  className="mt-2"
                  style={{ maxHeight: "200px" }}
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newBook.title || ""}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={newBook.author || ""}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                value={newBook.isbn || ""}
                onChange={(e) =>
                  setNewBook({ ...newBook, isbn: e.target.value })
                }
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" onClick={handleAddBook}>
                <FaUpload className="me-2" />
                Add Book
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LibraryD;
