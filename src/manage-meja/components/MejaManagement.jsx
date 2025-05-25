import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';
import './MejaManagement.css';

function MejaManagement({ }) {
  const [mejas, setMejas] = useState([]);
  const [formData, setFormData] = useState({
    nomor: ''
  });
  const [selectedMeja, setSelectedMeja] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const eventSourceRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const token = localStorage.getItem('authToken')
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;

  useEffect(() => {
    connectToMejaStream();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [token]);

  const connectToMejaStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const serverUrl = process.env.REACT_APP_API_URL 
      ? `${process.env.REACT_APP_API_URL}/meja/admin/stream`
      : `http://localhost:8080/meja/admin/stream`;
    
    eventSourceRef.current = new EventSource(serverUrl);
    
    eventSourceRef.current.onopen = () => {
      console.log('Connected to meja stream');
      setConnectionStatus('connected');
      setError('');
      reconnectAttemptsRef.current = 0;
    };
    
    eventSourceRef.current.addEventListener('meja-update', (event) => {
      try {
        const mejaData = JSON.parse(event.data);
        setMejas(mejaData);
        setLastUpdated(new Date());
        setError(''); 
      } catch (error) {
        console.error('Error parsing meja data:', error);
        setError('Error processing real-time updates');
      }
    });
    
    eventSourceRef.current.onerror = (error) => {
      console.error('SSE error:', error);
      setConnectionStatus('disconnected');
      
      eventSourceRef.current.close();
      
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        setError(`Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
        
        setTimeout(() => {
          console.log(`Reconnection attempt ${reconnectAttemptsRef.current}`);
          connectToMejaStream();
        }, 2000 * reconnectAttemptsRef.current);
      } else {
        setError('Failed to connect to real-time updates. Please refresh the page.');
      }
    };
  };

  const fetchMejas = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllMeja(token);
      setMejas(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch tables: ' + error.message);
      setMejas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nomor) {
      setError('Table number is required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (selectedMeja) {
        await apiService.updateMeja(token, selectedMeja.nomor, formData);
        setSuccess('Table updated successfully');
      } else {
        await apiService.createMeja(token, formData);
        setSuccess('Table created successfully');
      }
      
      setFormData({ nomor: '' });
      setSelectedMeja(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (nomor) => {
    if (!window.confirm('Are you sure you want to delete this table?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await apiService.deleteMeja(token, nomor);
      setSuccess('Table deleted successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meja) => {
    setSelectedMeja(meja);
    setFormData({ nomor: meja.nomor });
  };

  const handleCancel = () => {
    setSelectedMeja(null);
    setFormData({ nomor: '' });
  };

  const handleAssignTable = async (mejaId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await apiService.setUserToMeja(token, mejaId, username);
      setSuccess('Table assigned successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (mejaId) => {
    if (!window.confirm('Are you sure you want to complete this order?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await apiService.completeOrder(token, mejaId);
      setSuccess('Order completed successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    fetchMejas();
  };

  const getCartItemsCount = (cart) => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const renderCartItems = (cart) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return <span className="meja-no-items">No items in cart</span>;
    }
    
    return (
      <div className="meja-cart-preview">
        <div className="meja-cart-summary">
          {cart.items.length} item(s), {getCartItemsCount(cart)} total
        </div>
        <div className="meja-cart-details">
          {cart.items.map((item, index) => (
            <div key={index} className="meja-cart-item-row">
              <span className="meja-cart-item-name">{item.menuName || 'Unknown Item'}</span>
              <span className="meja-quantity">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="meja-management-wrapper">
      <div className="meja-management">
        {/* Connection Status */}
        <div className={`meja-connection-status ${connectionStatus}`}>
          <div className="meja-status-indicator">
            <span className={`meja-status-dot ${connectionStatus}`}></span>
            {connectionStatus === 'connected' ? 'Real-time updates active' : 'Offline mode'}
          </div>
          {lastUpdated && (
            <div className="meja-last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <button 
            onClick={handleManualRefresh} 
            className="meja-refresh-btn"
            disabled={loading}
            title="Manual refresh"
          >
            ↻
          </button>
        </div>

        {/* Create/Edit Table Section */}
        <div className="meja-create-section">
          <h2>{selectedMeja ? 'Edit Table' : 'Create New Table'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="meja-create-form">
              <div className="meja-form-group">
                <label htmlFor="nomor">Table Number</label>
                <input
                  type="number"
                  id="nomor"
                  name="nomor"
                  value={formData.nomor}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Enter table number"
                />
              </div>
              
              <div className="meja-action-buttons">
                <button type="submit" disabled={loading} className="meja-create-btn">
                  {loading ? 'Processing...' : selectedMeja ? 'Update Table' : 'Create Table'}
                </button>
                
                {selectedMeja && (
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    disabled={loading}
                    className="meja-action-btn edit"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            {error && <p className="error" style={{color: '#dc2626', fontSize: '14px', marginTop: '8px'}}>{error}</p>}
            {success && <p className="success" style={{color: '#16a34a', fontSize: '14px', marginTop: '8px'}}>{success}</p>}
          </form>
        </div>
        
        {/* Table List Section */}
        <div className="meja-table-section">
          <h3>
            Table List 
            <span className="meja-table-count">({mejas.length} tables)</span>
          </h3>
          
          {mejas.length === 0 ? (
            <div style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>
              <p>No tables found. Create one to get started.</p>
            </div>
          ) : (
            <div className="meja-table-wrapper">
              <table className="meja-data-table">
                <thead>
                  <tr>
                    <th>Table #</th>
                    <th>Status</th>
                    <th>Current User</th>
                    <th>Cart Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mejas.map((meja) => (
                    <tr key={meja.id} className={meja.username ? 'occupied' : 'available'}>
                      <td>
                        <div className="meja-table-number">{meja.nomor}</div>
                        <div className="meja-table-id">ID: {meja.id}</div>
                      </td>
                      <td>
                        <span className={`meja-status-badge ${meja.username ? 'occupied' : 'available'}`}>
                          {meja.username ? 'Occupied' : 'Available'}
                        </span>
                      </td>
                      <td>
                        <span className={meja.username ? 'meja-current-user' : 'meja-not-assigned'}>
                          {meja.username || 'Not assigned'}
                        </span>
                      </td>
                      <td>
                        {meja.username ? renderCartItems(meja.cart) : <span className="meja-not-assigned">-</span>}
                      </td>
                      <td>
                        <div className="meja-action-buttons">
                          <button 
                            onClick={() => handleEdit(meja)} 
                            disabled={loading}
                            className="meja-action-btn edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(meja.nomor)} 
                            disabled={loading || meja.username}
                            className="meja-action-btn delete"
                            title={meja.username ? "Cannot delete occupied table" : "Delete table"}
                          >
                            Delete
                          </button>
                          {!meja.username ? (
                            <button 
                              onClick={() => handleAssignTable(meja.nomor)} 
                              disabled={loading}
                              className="meja-action-btn assign"
                            >
                              Assign to Me
                            </button>
                          ) : (
                            meja.username === username && (
                              <button 
                                onClick={() => handleCompleteOrder(meja.nomor)} 
                                disabled={loading}
                                className="meja-action-btn complete"
                              >
                                Complete Order
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MejaManagement;