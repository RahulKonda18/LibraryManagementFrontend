import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

const RemoveSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders } = useAuth();

  const fetchSubscribers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/subscribers', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSubscribers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDeleteSubscriber = async (subscriberId, subscriberName) => {
    if (window.confirm(`Are you sure you want to delete subscriber "${subscriberName}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${subscriberId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          alert('Subscriber deleted successfully!');
          fetchSubscribers();
        } else {
          alert('Failed to delete subscriber');
        }
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Error deleting subscriber');
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading subscribers...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Remove Subscribers</h2>
        <p className="admin-warning">⚠️ Warning: Deleting a subscriber will permanently remove their account and all associated data.</p>
      </div>

      <div className="subscribers-table-container">
        <h3>Current Subscribers</h3>
        {subscribers.length === 0 ? (
          <div className="no-data">No subscribers found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Wallet Balance</th>
                <th>Total Fines Paid</th>
                <th>Actions</th>
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
                  <td>
                    <button 
                      className="admin-button small danger"
                      onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RemoveSubscribers;
