import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import './Subscriber.css';

const BorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBorrowData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch complete borrow history
      const historyData = await apiService.getBorrowHistory(user.id);
      setBorrowHistory(historyData || []);

      // Fetch active borrows
      const activeData = await apiService.getActiveBorrows(user.id);
      setActiveBorrows(activeData || []);

      // Fetch unpaid fines
      const finesData = await apiService.getUnpaidFines(user.id);
      setUnpaidFines(finesData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrow data:', error);
      setLoading(false);
    }
  }, [user?.id]);

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

  const handlePayFine = async (borrowRecordId, fineAmount) => {
    // Only allow paying fines if there's actually a fine amount
    if (!fineAmount || fineAmount <= 0) {
      alert('No fine amount to pay for this record.');
      return;
    }

    if (!window.confirm(`Are you sure you want to pay ₹${fineAmount} fine?`)) {
      return;
    }

    try {
      await apiService.payFine(user.id, borrowRecordId);
      alert('Fine paid successfully!');
      fetchBorrowData();
    } catch (error) {
      console.error('Error paying fine:', error);
      alert(`Error paying fine: ${error.message || 'Unknown error'}`);
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
          <div className="count">{unpaidFines.filter(fine => fine.fineAmount > 0).length}</div>
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

        {unpaidFines.filter(fine => fine.fineAmount > 0).length > 0 && (
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
                {unpaidFines
                  .filter(fine => fine.fineAmount > 0)
                  .map(fine => (
                    <tr key={fine.id}>
                      <td>{fine.book?.title}</td>
                      <td>{formatDate(fine.borrowDate)}</td>
                      <td>{fine.returnDate ? formatDate(fine.returnDate) : '-'}</td>
                      <td>₹{fine.fineAmount || 0}</td>
                      <td>
                        <button 
                          className="subscriber-button small"
                          onClick={() => handlePayFine(fine.id, fine.fineAmount)}
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
