import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    UserService.getAllUsers()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setSelectedRoles(user.roles.map(role => role.name));
  };

  const handleRoleChange = (roleName) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter(role => role !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleUpdateRoles = () => {
    if (!editingUser) return;

    UserService.updateUserRoles(editingUser.id, selectedRoles)
      .then(() => {
        setSuccessMessage(`Updated roles for ${editingUser.username}`);
        setEditingUser(null);
        fetchUsers();
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
      });
  };

  const handleDeleteUser = (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      UserService.deleteUser(userId)
        .then(() => {
          setSuccessMessage(`User ${username} successfully deleted`);
          fetchUsers();
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setError(message);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-hacker-dark-700 p-6 rounded-sm border border-hacker-green-700 shadow-lg">
        <header className="mb-6">
          <h3 className="text-2xl font-bold">
            <span className="text-hacker-green-300">&lt;</span> Admin Control Panel <span className="text-hacker-green-300">/&gt;</span>
          </h3>
        </header>
        
        <div className="font-mono text-hacker-green-400 bg-hacker-dark-800 p-6 rounded-sm border border-hacker-green-700 shadow-inner mb-8">
          <p className="mb-3">$ ./admin_panel.sh</p>
          <p className="mb-3 text-hacker-green-300">== ADMIN ACCESS GRANTED ==</p>
          <p className="mb-3">Authentication: <span className="text-hacker-green-500">VERIFIED</span></p>
          <p className="mb-3">Role: <span className="text-hacker-green-500">ADMINISTRATOR</span></p>
          <p className="mb-3">Message: {content}</p>
          <p className="mb-3">$ _<span className="animate-pulse">|</span></p>
        </div>

        {successMessage && (
          <div className="bg-green-900 border border-green-700 text-white p-4 mb-6 rounded-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-white p-4 mb-6 rounded-sm">
            {error}
          </div>
        )}
        
        <h4 className="text-xl font-bold mb-4">User Management</h4>
        
        {loading ? (
          <div className="text-center p-4">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-hacker-green-500 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-hacker-green-400">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-hacker-dark-800 border border-hacker-green-700">
              <thead>
                <tr className="bg-hacker-dark-900 text-hacker-green-400">
                  <th className="py-2 px-4 text-left border-b border-hacker-green-700">ID</th>
                  <th className="py-2 px-4 text-left border-b border-hacker-green-700">Username</th>
                  <th className="py-2 px-4 text-left border-b border-hacker-green-700">Email</th>
                  <th className="py-2 px-4 text-left border-b border-hacker-green-700">Roles</th>
                  <th className="py-2 px-4 text-left border-b border-hacker-green-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-hacker-green-900 hover:bg-hacker-dark-700">
                    <td className="py-2 px-4">{user.id}</td>
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {user.roles.map(role => role.name).join(", ")}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-2 py-1 rounded-sm mr-2 text-sm hover:bg-hacker-dark-600"
                      >
                        Edit Roles
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="bg-red-900 text-white border border-red-700 px-2 py-1 rounded-sm text-sm hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-hacker-dark-800 p-6 rounded-sm border border-hacker-green-700 shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">
                Edit Roles for {editingUser.username}
              </h3>
              
              <div className="mb-4">
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes("ROLE_USER")}
                      onChange={() => handleRoleChange("ROLE_USER")}
                      className="mr-2"
                    />
                    <span>User</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes("ROLE_MODERATOR")}
                      onChange={() => handleRoleChange("ROLE_MODERATOR")}
                      className="mr-2"
                    />
                    <span>Moderator</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes("ROLE_ADMIN")}
                      onChange={() => handleRoleChange("ROLE_ADMIN")}
                      className="mr-2"
                    />
                    <span>Admin</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-4 py-2 rounded-sm hover:bg-hacker-dark-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRoles}
                  className="bg-hacker-green-800 text-white border border-hacker-green-700 px-4 py-2 rounded-sm hover:bg-hacker-green-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardAdmin;