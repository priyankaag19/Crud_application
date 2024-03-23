import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailPattern.test(email) ? '' : 'Invalid email format');
  };

  const validatePhone = (phone) => {
    const phonePattern = /^\d{10}$/;
    setPhoneError(phonePattern.test(phone) ? '' : 'Phone number must be 10 digits');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedContactId) {
        await axios.put(`http://localhost:5000/api/contacts/${selectedContactId}`, newContact);
      } else {
        await axios.post('http://localhost:5000/api/contacts', newContact);
      }
      setNewContact({ name: '', email: '', phone: '' });
      setSelectedContactId(null);
      fetchContacts();
    } catch (error) {
      console.error('Error adding/updating contact:', error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const updateContact = async (contact) => {
    setNewContact(contact);
    setSelectedContactId(contact._id);
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-light bg-secondary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Contact App</span>
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control" name="name" placeholder="Name" value={newContact.name} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" name="email" placeholder="Email" value={newContact.email} onChange={e => { handleInputChange(e); validateEmail(e.target.value); }} required />
          {emailError && <div className="text-danger">{emailError}</div>}
        </div>
        <div className="mb-3">
          <input type="tel" className="form-control" name="phone" placeholder="Phone" value={newContact.phone} onChange={e => { handleInputChange(e); validatePhone(e.target.value); }} required />
          {phoneError && <div className="text-danger">{phoneError}</div>}
        </div>
        <button type="submit" className="btn btn-info">{selectedContactId ? 'Update Contact' : 'Add Contact'}</button>
      </form>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <button className="btn btn-success me-2" onClick={() => updateContact(contact)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteContact(contact._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
