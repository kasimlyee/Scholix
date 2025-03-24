import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landingpage from "./pages/Landingpage";
import Dashboard from "./pages/Dashboard";
import Payout from "./pages/Payout";
import Users from "./components/Users";
import SignAdmin from "./components/SignAdmin";
import Register from "./pages/Register";
import LibraryD from "./pages/LibraryD";
import SmsSender from "./pages/SmsSender";
import StudentDashboard from "./components/student/StudentDashboard";
import SignUp from "./components/signup";
import Login from "./components/signIn";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

interface SignUpProps {
  availableRoles?: string[];
}

interface ProtectedRouteProps<T extends object = {}> {
  component: React.FC<T>;
  allowedRoles: string[];
  componentProps?: T;
}

const ProtectedRoute = <T extends object = {}>({
  component: Component,
  allowedRoles,
  componentProps = {} as T,
}: ProtectedRouteProps<T>) => {
  const { user } = useAuth();

  if (!user.token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role || "")) return <div>Access Denied</div>;
  return <Component {...componentProps} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                component={Dashboard}
                allowedRoles={["Admin", "Staff"]}
              />
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute
                component={StudentDashboard}
                allowedRoles={["Admin", "DOS"]}
              />
            }
          />
          <Route
            path="/admissions"
            element={
              <ProtectedRoute
                component={StudentDashboard}
                allowedRoles={["Admin"]}
              />
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute
                component={StudentDashboard}
                allowedRoles={["Admin"]}
              />
            }
          />
          <Route
            path="/teachers"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute
                component={StudentDashboard}
                allowedRoles={["Admin", "Staff"]}
              />
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute
                component={StudentDashboard}
                allowedRoles={["Admin"]}
              />
            }
          />
          <Route
            path="/grades"
            element={
              <ProtectedRoute
                component={StudentDashboard}
                allowedRoles={["Admin"]}
              />
            }
          />
          <Route
            path="/fees"
            element={
              <ProtectedRoute
                component={Payout}
                allowedRoles={["Admin", "Bursar"]}
              />
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute
                component={Payout}
                allowedRoles={["Admin", "Bursar"]}
              />
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute
                component={LibraryD}
                allowedRoles={["Admin", "Librarian"]}
              />
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute
                component={LibraryD}
                allowedRoles={["Admin", "Librarian"]}
              />
            }
          />
          <Route
            path="/hostel"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/transport"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/notices"
            element={
              <ProtectedRoute
                component={SmsSender}
                allowedRoles={["Admin", "Staff"]}
              />
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute
                component={SmsSender}
                allowedRoles={["Admin", "Staff"]}
              />
            }
          />
          <Route
            path="/parents"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute component={Register} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute<SignUpProps>
                component={SignUp}
                allowedRoles={["Admin"]}
              />
            }
          />
          <Route
            path="/signAdmin"
            element={
              <ProtectedRoute component={SignAdmin} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute component={Users} allowedRoles={["Admin"]} />
            }
          />
          <Route
            path="/logout"
            element={
              <Navigate to="/login" />
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
