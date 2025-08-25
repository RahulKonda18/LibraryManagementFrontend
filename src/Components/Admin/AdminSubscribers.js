import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });

  const fetchSubscribers = useCallback(async () => {
    try {
      const data = await apiService.getAdminSubscribers();
      setSubscribers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    try {
      await apiService.register({
        ...formData,
        role: 'SUBSCRIBER'
      });
      
      setFormData({ username: '', password: '', name: '', email: '' });
      setShowAddForm(false);
      fetchSubscribers();
      alert('Subscriber added successfully!');
    } catch (error) {
      console.error('Error adding subscriber:', error);
      alert('Error adding subscriber');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading subscribers...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Manage Subscribers</h2>
        <button 
          className="admin-button primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Subscriber
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-container">
          <h3>Add New Subscriber</h3>
          <form onSubmit={handleAddSubscriber} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="admin-button primary">Add Subscriber</button>
              <button 
                type="button" 
                className="admin-button secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="subscribers-table-container">
        <h3>Current Subscribers</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Wallet Balance</th>
              <th>Total Fines Paid</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(subscriber => (
              <tr key={subscriber.id}>
                <td>{subscriber.id}</td>
                <td>{subscriber.username}</td>
                <td>{subscriber.name}</td>
                <td>{subscriber.email}</td>
                <td>₹{subscriber.walletBalance || 0}</td>
                <td>₹{subscriber.totalFinesPaid || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscribers;
