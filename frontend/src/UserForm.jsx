import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Input change handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const phoneRegex = /^\d{10,}$/;

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone number must be at least 10 digits and numeric";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch users on component load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingUser) {
        await updateUser(editingUser.id);
      } else {
        await createUser();
      }
    }
  };

  const createUser = async () => {
    try {
      const res = await axios.post(`${backendUrl}/users`, formData);
      setUsers([...users, res.data]);
      resetForm();
    } catch (err) {
      alert(err.response.data.error)
    }
  };

  const updateUser = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/users/${id}`, formData);
      setUsers(users.map(user => (user.id === id ? res.data : user)));
      setEditingUser(null);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const editUser = (user) => {
    setFormData({
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      email: user.email,
      address: user.address
    });
    setEditingUser(user);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', phone: '', email: '', address: ''
    });
    setFormErrors({});
    setEditingUser(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow-md rounded">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className={`border p-2 rounded ${formErrors.firstName ? 'border-red-500' : ''}`}
            />
            {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
          </div>

          <div>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className={`border p-2 rounded ${formErrors.lastName ? 'border-red-500' : ''}`}
            />
            {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
          </div>

          <div>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className={`border p-2 rounded ${formErrors.phone ? 'border-red-500' : ''}`}
            />
            {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
          </div>

          <div>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`border p-2 rounded ${formErrors.email ? 'border-red-500' : ''}`}
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>

          <div className="col-span-2">
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className={`border p-2 rounded w-full ${formErrors.address ? 'border-red-500' : ''}`}
            />
            {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingUser ? 'Update User' : 'Create User'}
          </button>
          {editingUser && (
            <button
              type="button"
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">First Name</th>
            <th className="py-2 px-4 border-b">Last Name</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-10 border-b">{user.first_name}</td>
              <td className="py-2 px-10 border-b">{user.last_name}</td>
              <td className="py-2 px-10 border-b">{user.phone}</td>
              <td className="py-2 px-10 border-b">{user.email}</td>
              <td className="py-2 px-10 border-b">{user.address}</td>
              <td className="py-2 px-10 border-b">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 rounded mr-2 hover:bg-yellow-600"
                  onClick={() => editUser(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserForm;
