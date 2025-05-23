import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';
import './MejaManagement.css';

function MejaManagement({ token, username }) {
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
      return <span className="no-items">No items in cart</span>;
    }
    
    return (
      <div className="cart-items-preview">
        <div className="cart-summary">
          {cart.items.length} item(s), {getCartItemsCount(cart)} total
        </div>
        <div className="cart-details">
          {cart.items.map((item, index) => (
            <div key={index} className="cart-item-row">
              <span>{item.menuName || 'Unknown Item'}</span>
              <span className="quantity">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="meja-container">
      {/* Connection Status */}
      <div className={`connection-status ${connectionStatus}`}>
        <div className="status-indicator">
          <span className={`status-dot ${connectionStatus}`}></span>
          {connectionStatus === 'connected' ? 'Real-time updates active' : 'Offline mode'}
        </div>
        {lastUpdated && (
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
        <button 
          onClick={handleManualRefresh} 
          className="refresh-btn"
          disabled={loading}
          title="Manual refresh"
        >
          ↻
        </button>
      </div>

      <div className="meja-form">
        <h2>{selectedMeja ? 'Edit Table' : 'Create New Table'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nomor">Table Number</label>
            <input
              type="number"
              id="nomor"
              name="nomor"
              value={formData.nomor}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : selectedMeja ? 'Update Table' : 'Create Table'}
            </button>
            
            {selectedMeja && (
              <button 
                type="button" 
                onClick={handleCancel} 
                disabled={loading}
                className="warning"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="meja-list">
        <h2>Table List ({mejas.length} tables)</h2>
        
        {mejas.length === 0 ? (
          <p>No tables found. Create one to get started.</p>
        ) : (
          <div className="table-container">
            <table>
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
                      <strong>{meja.nomor}</strong>
                      <small>(ID: {meja.id})</small>
                    </td>
                    <td>
                      <span className={`status-badge ${meja.username ? 'occupied' : 'available'}`}>
                        {meja.username ? 'Occupied' : 'Available'}
                      </span>
                    </td>
                    <td>{meja.username || 'Not assigned'}</td>
                    <td>
                      {meja.username ? renderCartItems(meja.cart) : '-'}
                    </td>
                    <td>
                      <div className="button-group">
                        <button 
                          onClick={() => handleEdit(meja)} 
                          disabled={loading}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(meja.nomor)} 
                          disabled={loading || meja.username}
                          className="danger"
                          title={meja.username ? "Cannot delete occupied table" : "Delete table"}
                        >
                          Delete
                        </button>
                        {!meja.username ? (
                          <button 
                            onClick={() => handleAssignTable(meja.nomor)} 
                            disabled={loading}
                            className="assign-btn"
                          >
                            Assign to Me
                          </button>
                        ) : (
                          meja.username === username && (
                            <button 
                              onClick={() => handleCompleteOrder(meja.nomor)} 
                              disabled={loading}
                              className="complete-btn"
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
  );
}

export default MejaManagement;