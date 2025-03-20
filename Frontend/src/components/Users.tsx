import { useState } from "react";
import axios from "axios";

//defining users
type User = {
  name: string;
  role: string;
  email: string;
};

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    name: "",
    role: "",
    email: "",
  });

  //handling from input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  //adding new user
  const addUser = () => {
    if (newUser.name && newUser.role && newUser.email) {
      axios
        .post("http://localhost:8080/api/users", newUser)
        .then((response) => {
          setUsers([...users, response.data]);
          setNewUser({ name: "", role: "", email: "" });
        })
        .catch((error) => {
          console.error("There was an error saving the user!", error);
        });
    } else {
      alert("All fields are required.");
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Users</h2>
      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="text-center mb-3">Add new user</h4>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              placeholder="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="form-control"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={newUser.role}
              onChange={handleInputChange}
              className="form-control"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={addUser}>
          Add User
        </button>
      </div>
      {/*Display List of Users */}
      <div className="card p-4 shadow-sm">
        <h4 className="text-center mb-3">Users Created:</h4>
        {users.length > 0 ? (
          <ul className="list-group">
            {users.map((user, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  <strong>
                    {user.name} - {user.role} - {user.email}
                  </strong>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">No Users created yet</p>
        )}
      </div>
    </div>
  );
}

export default Users;
