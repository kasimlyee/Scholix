import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Dashboard from "./pages/Dashboard";
import SignIn from "./components/signIn";
import Payout from "./pages/Payout";
import Users from "./components/Users";
import SignAdmin from "./components/SignAdmin";
import UploadStudents from "./components/UploadStudents";
import Register from "./pages/Register";
import LibraryD from "./pages/LibraryD";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/payout" element={<Payout />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signAdmin" element={<SignAdmin />} />
        <Route path="/students" element={<UploadStudents />} />
        <Route path="/create" element={<Register />} />
        <Route path="/library" element={<LibraryD />} />
      </Routes>
    </Router>
  );
}

export default App;
