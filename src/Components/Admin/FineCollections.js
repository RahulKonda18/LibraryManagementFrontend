import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

const FineCollections = () => {
  const [totalFines, setTotalFines] = useState(0);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders } = useAuth();

  const fetchFineData = useCallback(async () => {
    try {
      // Fetch total fines collected
      const totalFinesResponse = await fetch('http://localhost:8080/api/admin/total-fines', {
        headers: getAuthHeaders()
      });
      const totalFinesData = await totalFinesResponse.json();
      setTotalFines(totalFinesData || 0);

      // Fetch unpaid fines
      const unpaidFinesResponse = await fetch('http://localhost:8080/api/admin/unpaid-fines', {
        headers: getAuthHeaders()
      });
      const unpaidFinesData = await unpaidFinesResponse.json();
      setUnpaidFines(unpaidFinesData || []);

      // Fetch active borrows
      const activeBorrowsResponse = await fetch('http://localhost:8080/api/admin/active-borrows', {
        headers: getAuthHeaders()
      });
      const activeBorrowsData = await activeBorrowsResponse.json();
      setActiveBorrows(activeBorrowsData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching fine data:', error);
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchFineData();
  }, [fetchFineData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateFineAmount = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 5 : 0; // ₹5 per day
  };

  if (loading) {
    return <div className="admin-loading">Loading fine collections...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Fine Collections</h2>
      </div>

      <div className="fine-summary">
        <div className="summary-card">
          <h3>Total Fines Collected</h3>
          <div className="amount">₹{totalFines}</div>
        </div>
        <div className="summary-card">
          <h3>Unpaid Fines</h3>
          <div className="amount">₹{unpaidFines.reduce((sum, fine) => sum + (fine.fineAmount || 0), 0)}</div>
        </div>
        <div className="summary-card">
          <h3>Active Borrows</h3>
          <div className="amount">{activeBorrows.length}</div>
        </div>
      </div>

      <div className="fine-sections">
        <div className="fine-section">
          <h3>Unpaid Fines</h3>
          {unpaidFines.length === 0 ? (
            <div className="no-data">No unpaid fines found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {unpaidFines.map(fine => (
                  <tr key={fine.id}>
                    <td>{fine.user?.name || fine.user?.username}</td>
                    <td>{fine.book?.title}</td>
                    <td>{formatDate(fine.borrowDate)}</td>
                    <td>{formatDate(fine.dueDate)}</td>
                    <td>{fine.returnDate ? formatDate(fine.returnDate) : '-'}</td>
                    <td>₹{fine.fineAmount || 0}</td>
                    <td>
                      <span className="status unpaid">Unpaid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="fine-section">
          <h3>Active Borrows (Potential Fines)</h3>
          {activeBorrows.length === 0 ? (
            <div className="no-data">No active borrows found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Potential Fine</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeBorrows.map(borrow => {
                  const potentialFine = calculateFineAmount(borrow.dueDate);
                  const isOverdue = potentialFine > 0;
                  
                  return (
                    <tr key={borrow.id}>
                      <td>{borrow.user?.name || borrow.user?.username}</td>
                      <td>{borrow.book?.title}</td>
                      <td>{formatDate(borrow.borrowDate)}</td>
                      <td>{formatDate(borrow.dueDate)}</td>
                      <td>{isOverdue ? Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24)) : 0}</td>
                      <td>₹{potentialFine}</td>
                      <td>
                        <span className={`status ${isOverdue ? 'overdue' : 'active'}`}>
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FineCollections;
