import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function MejaManagement({ token, username }) {
  const [mejas, setMejas] = useState([]);
  const [formData, setFormData] = useState({
    nomor: ''
  });
  const [selectedMeja, setSelectedMeja] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchMejas();
  }, [token, refreshKey]);

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
        await apiService.updateMeja(token, selectedMeja.id, formData);
        setSuccess('Table updated successfully');
      } else {
        await apiService.createMeja(token, formData);
        setSuccess('Table created successfully');
      }
      
      setFormData({ nomor: '' });
      setSelectedMeja(null);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await apiService.deleteMeja(token, id);
      setSuccess('Table deleted successfully');
      setRefreshKey(prevKey => prevKey + 1);
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
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (mejaId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await apiService.completeOrder(token, mejaId);
      setSuccess('Order completed successfully');
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meja-container">
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
        <h2>Table List</h2>
        {loading && <p>Loading tables...</p>}
        
        {mejas.length === 0 && !loading ? (
          <p>No tables found. Create one to get started.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Table Number</th>
                  <th>Current User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mejas.map((meja) => (
                  <tr key={meja.id}>
                    <td>{meja.id}</td>
                    <td>{meja.nomor}</td>
                    <td>{meja.username || 'Not assigned'}</td>
                    <td>
                      <div className="button-group">
                        <button 
                          onClick={() => handleEdit(meja)} 
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(meja.id)} 
                          disabled={loading}
                          className="danger"
                        >
                          Delete
                        </button>
                        {!meja.username ? (
                          <button 
                            onClick={() => handleAssignTable(meja.id)} 
                            disabled={loading}
                          >
                            Assign to Me
                          </button>
                        ) : (
                          meja.username === username && (
                            <button 
                              onClick={() => handleCompleteOrder(meja.id)} 
                              disabled={loading}
                              className="warning"
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