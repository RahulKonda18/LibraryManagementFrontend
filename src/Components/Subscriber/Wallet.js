import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Subscriber.css';

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalFinesPaid, setTotalFinesPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const { user, getAuthHeaders } = useAuth();

  const fetchWalletData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch wallet balance
      const balanceResponse = await fetch(`http://localhost:8080/api/users/${user.id}/wallet`, {
        headers: getAuthHeaders()
      });
      const balanceData = await balanceResponse.json();
      setWalletBalance(balanceData || 0);

      // Fetch total fines paid
      const finesResponse = await fetch(`http://localhost:8080/api/users/${user.id}/fines`, {
        headers: getAuthHeaders()
      });
      const finesData = await finesResponse.json();
      setTotalFinesPaid(finesData || 0);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setLoading(false);
    }
  }, [user?.id, getAuthHeaders]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}/wallet/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      if (response.ok) {
        alert('Money added successfully!');
        setAmount('');
        setShowAddMoney(false);
        fetchWalletData();
      } else {
        alert('Failed to add money');
      }
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Error adding money');
    }
  };

  if (loading) {
    return <div className="subscriber-loading">Loading wallet...</div>;
  }

  return (
    <div className="subscriber-container">
      <div className="subscriber-header">
        <h2>My Wallet</h2>
      </div>

      <div className="wallet-summary">
        <div className="wallet-card">
          <h3>Current Balance</h3>
          <div className="balance-amount">₹{walletBalance}</div>
          <button 
            className="subscriber-button primary"
            onClick={() => setShowAddMoney(true)}
          >
            Add Money
          </button>
        </div>

        <div className="wallet-card">
          <h3>Total Fines Paid</h3>
          <div className="fines-amount">₹{totalFinesPaid}</div>
          <p className="wallet-info">Lifetime total of fines paid</p>
        </div>
      </div>

      {showAddMoney && (
        <div className="add-money-form">
          <h3>Add Money to Wallet</h3>
          <form onSubmit={handleAddMoney}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="subscriber-button primary">
                Add Money
              </button>
              <button 
                type="button" 
                className="subscriber-button secondary"
                onClick={() => {
                  setShowAddMoney(false);
                  setAmount('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="wallet-info-section">
        <h3>Wallet Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Initial Balance:</strong> ₹200.00
          </div>
          <div className="info-item">
            <strong>Fine Rate:</strong> ₹5 per day for overdue books
          </div>
          <div className="info-item">
            <strong>Borrowing Period:</strong> 14 days
          </div>
          <div className="info-item">
            <strong>Auto-Deduction:</strong> Fines are automatically deducted from wallet
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
