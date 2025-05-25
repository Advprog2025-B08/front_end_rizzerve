import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './UserTablePanel.css';

function UserTablePanel() {
  const [currentMeja, setCurrentMeja] = useState(null);
  const [mejaNumber, setMejaNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);

  const token = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData?.username;

  useEffect(() => {
    checkCurrentMejaStatus();
  }, []);

  const checkCurrentMejaStatus = async () => {
    setCheckingStatus(true);
    try {
      const allMejas = await apiService.getAllMeja(token);
      const userMeja = allMejas.find(meja => meja.username === username);
      setCurrentMeja(userMeja || null);
      setError('');
    } catch (error) {
      console.error('Error checking meja status:', error);
      setError('Failed to check your table status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleJoinMeja = async (e) => {
    e.preventDefault();
    
    if (!mejaNumber) {
      setError('Please enter a table number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.setUserToMeja(token, parseInt(mejaNumber), username);
      setSuccess(`Successfully joined Table ${mejaNumber}!`);
      setMejaNumber('');
      
      // Refresh status after joining
      setTimeout(() => {
        checkCurrentMejaStatus();
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to join table');
    } finally {
      setLoading(false);
    }
  };

  const handleExitMeja = async () => {
    if (!window.confirm('Are you sure you want to leave this table? This will complete your order.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.completeOrder(token, currentMeja.nomor);
      setSuccess('Successfully left the table!');
      
      // Refresh status after leaving
      setTimeout(() => {
        checkCurrentMejaStatus();
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to leave table');
    } finally {
      setLoading(false);
    }
  };

  const getCartItemsCount = (cart) => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const renderCartItems = (cart) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return <span className="no-items">No items in cart</span>;
    }
    
    return (
      <div className="cart-summary">
        <h4>Your Cart ({cart.items.length} items, {getCartItemsCount(cart)} total)</h4>
        <div className="cart-items-list">
          {cart.items.map((item, index) => (
            <div key={index} className="cart-item">
              <span className="item-name">{item.menuName || 'Unknown Item'}</span>
              <span className="item-quantity">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (checkingStatus) {
    return (
      <div className="user-table-panel">
        <div className="status-card">
          <h2>Checking your table status...</h2>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-table-panel">
      <div className="panel-header">
        <h1>🍽️ My Table</h1>
        <p>Welcome, {username}!</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {currentMeja ? (
        // User is currently at a table
        <div className="current-table-section">
          <div className="table-status-card">
            <div className="table-info">
              <h2>You are currently at Table {currentMeja.nomor}</h2>
              <div className="table-details">
                <div className="detail-item">
                  <span className="label">Table ID:</span>
                  <span className="value">{currentMeja.id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value occupied">Occupied</span>
                </div>
              </div>
            </div>

            <div className="cart-section">
              {renderCartItems(currentMeja.cart)}
            </div>

            <div className="action-section">
              <button 
                onClick={handleExitMeja}
                disabled={loading}
                className="exit-btn"
              >
                {loading ? 'Leaving Table...' : 'Complete Order & Leave Table'}
              </button>
              <p className="action-note">
                This will complete your order and make the table available for others.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // User is not at any table
        <div className="join-table-section">
          <div className="join-table-card">
            <div className="card-header">
              <h2>Join a Table</h2>
              <p>Enter the table number where you're seated</p>
            </div>

            <form onSubmit={handleJoinMeja} className="join-form">
              <div className="form-group">
                <label htmlFor="mejaNumber">Table Number</label>
                <input
                  type="number"
                  id="mejaNumber"
                  value={mejaNumber}
                  onChange={(e) => setMejaNumber(e.target.value)}
                  placeholder="Enter table number (e.g., 1, 2, 3...)"
                  disabled={loading}
                  min="1"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !mejaNumber}
                className="join-btn"
              >
                {loading ? 'Joining Table...' : 'Join Table'}
              </button>
            </form>

            <div className="info-section">
              <h3>How it works:</h3>
              <ul>
                <li>🪑 Find your table number (usually displayed on the table)</li>
                <li>📱 Enter the number above and click "Join Table"</li>
                <li>🛒 Start adding items to your cart</li>
                <li>✅ Complete your order when finished</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="refresh-section">
        <button 
          onClick={checkCurrentMejaStatus}
          disabled={loading || checkingStatus}
          className="refresh-btn"
        >
          🔄 Refresh Status
        </button>
      </div>
    </div>
  );
}

export default UserTablePanel;