import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Subscriber.css';

const BorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getAuthHeaders } = useAuth();

  const fetchBorrowData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch complete borrow history
      const historyResponse = await fetch(`http://localhost:8080/api/borrows/${user.id}/history`, {
        headers: getAuthHeaders()
      });
      const historyData = await historyResponse.json();
      setBorrowHistory(historyData || []);

      // Fetch active borrows
      const activeResponse = await fetch(`http://localhost:8080/api/borrows/${user.id}/active`, {
        headers: getAuthHeaders()
      });
      const activeData = await activeResponse.json();
      setActiveBorrows(activeData || []);

      // Fetch unpaid fines
      const finesResponse = await fetch(`http://localhost:8080/api/borrows/${user.id}/unpaid-fines`, {
        headers: getAuthHeaders()
      });
      const finesData = await finesResponse.json();
      setUnpaidFines(finesData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrow data:', error);
      setLoading(false);
    }
  }, [user?.id, getAuthHeaders]);

  useEffect(() => {
    fetchBorrowData();
  }, [fetchBorrowData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (borrow) => {
    if (borrow.returned) {
      return <span className="status-badge returned">Returned</span>;
    } else {
      const dueDate = new Date(borrow.dueDate);
      const today = new Date();
      if (today > dueDate) {
        return <span className="status-badge overdue">Overdue</span>;
      } else {
        return <span className="status-badge active">Active</span>;
      }
    }
  };

  const handlePayFine = async (borrowRecordId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/borrows/${user.id}/fines/${borrowRecordId}/pay`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Fine paid successfully!');
        fetchBorrowData();
      } else {
        alert('Failed to pay fine. Please check your wallet balance.');
      }
    } catch (error) {
      console.error('Error paying fine:', error);
      alert('Error paying fine');
    }
  };

  if (loading) {
    return <div className="subscriber-loading">Loading borrow history...</div>;
  }

  return (
    <div className="subscriber-container">
      <div className="subscriber-header">
        <h2>My Borrow History</h2>
      </div>

      <div className="borrow-summary">
        <div className="summary-card">
          <h3>Total Books Borrowed</h3>
          <div className="count">{borrowHistory.length}</div>
        </div>
        <div className="summary-card">
          <h3>Currently Borrowed</h3>
          <div className="count">{activeBorrows.length}</div>
        </div>
        <div className="summary-card">
          <h3>Unpaid Fines</h3>
          <div className="count">{unpaidFines.length}</div>
        </div>
      </div>

      <div className="borrow-sections">
        {activeBorrows.length > 0 && (
          <div className="borrow-section">
            <h3>Currently Borrowed</h3>
            <table className="subscriber-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeBorrows.map(borrow => (
                  <tr key={borrow.id}>
                    <td>{borrow.book?.title}</td>
                    <td>{formatDate(borrow.borrowDate)}</td>
                    <td>{formatDate(borrow.dueDate)}</td>
                    <td>{getStatusBadge(borrow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {unpaidFines.length > 0 && (
          <div className="borrow-section">
            <h3>Unpaid Fines</h3>
            <table className="subscriber-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Fine Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unpaidFines.map(fine => (
                  <tr key={fine.id}>
                    <td>{fine.book?.title}</td>
                    <td>{formatDate(fine.borrowDate)}</td>
                    <td>{fine.returnDate ? formatDate(fine.returnDate) : '-'}</td>
                    <td>₹{fine.fineAmount || 0}</td>
                    <td>
                      <button 
                        className="subscriber-button small"
                        onClick={() => handlePayFine(fine.id)}
                      >
                        Pay Fine
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="borrow-section">
          <h3>Complete History</h3>
          {borrowHistory.length === 0 ? (
            <div className="no-data">No borrow history found.</div>
          ) : (
            <table className="subscriber-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowHistory.map(borrow => (
                  <tr key={borrow.id}>
                    <td>{borrow.book?.title}</td>
                    <td>{formatDate(borrow.borrowDate)}</td>
                    <td>{formatDate(borrow.dueDate)}</td>
                    <td>{borrow.returnDate ? formatDate(borrow.returnDate) : '-'}</td>
                    <td>₹{borrow.fineAmount || 0}</td>
                    <td>{getStatusBadge(borrow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowHistory;
