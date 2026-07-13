import { useState, useEffect } from 'react';
import API from '../../services/api';
import AddMedicineModal from '../../components/Modals/AddMedicineModal';
import './AdminInventory.css';

const AdminInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch medicines from API
  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching admin inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Delete Medicine Handler (Admin Privilege)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine record?')) {
      try {
        await API.delete(`/medicines/${id}`);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert(error.response?.data?.message || 'Failed to delete item.');
      }
    }
  };

  // Filter Logic
  const filteredMedicines = medicines.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Admin KPI Calculations
  const totalItems = medicines.length;
  const totalValuation = medicines.reduce(
    (acc, item) => acc + (item.price * item.stock || 0),
    0
  );
  const lowStockCount = medicines.filter((m) => m.stock > 0 && m.stock <= 10).length;
  const outOfStockCount = medicines.filter((m) => m.stock === 0).length;

  return (
    <div className="admin-inventory-page">
      {/* Header Bar */}
      <div className="admin-inventory-header">
        <div>
          <div className="admin-badge">Admin Controls</div>
          <h1 className="page-title">Inventory Master & Valuation</h1>
          <p className="page-subtitle">
            Manage store stock, item pricing, and inventory valuation
          </p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Inventory Items</span>
          <span className="kpi-value">{totalItems}</span>
        </div>
        <div className="kpi-card primary">
          <span className="kpi-label">Total Stock Valuation</span>
          <span className="kpi-value">₹{totalValuation.toLocaleString('en-IN')}</span>
        </div>
        <div className="kpi-card warning">
          <span className="kpi-label">Low Stock Items</span>
          <span className="kpi-value">{lowStockCount}</span>
        </div>
        <div className="kpi-card danger">
          <span className="kpi-label">Out of Stock</span>
          <span className="kpi-value">{outOfStockCount}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-inventory-toolbar">
        <input
          type="text"
          placeholder="🔍 Search medicine, brand, or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="All">All Categories</option>
          <option value="Analgesics">Analgesics</option>
          <option value="Antibiotics">Antibiotics</option>
          <option value="Antipyretics">Antipyretics</option>
          <option value="Vitamins">Vitamins</option>
          <option value="Supplements">Supplements</option>
        </select>
      </div>

      {/* Admin Table */}
      <div className="table-card">
        {isLoading ? (
          <div className="table-loading">Loading inventory data...</div>
        ) : filteredMedicines.length === 0 ? (
          <div className="table-empty">No inventory records found.</div>
        ) : (
          <table className="admin-inventory-table">
            <thead>
              <tr>
                <th>Product / Brand</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock Qty</th>
                <th>Asset Valuation (₹)</th>
                <th>Batch No.</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((item) => {
                let stockStatus = 'in-stock';
                if (item.stock === 0) stockStatus = 'out-stock';
                else if (item.stock <= 10) stockStatus = 'low-stock';

                const totalItemValuation = (item.price * item.stock).toFixed(2);

                return (
                  <tr key={item._id}>
                    <td>
                      <div className="item-name">{item.name}</div>
                      <div className="item-brand">{item.brand || 'Generic'}</div>
                    </td>
                    <td>{item.category}</td>
                    <td className="font-semibold">₹{item.price}</td>
                    <td>
                      <span className={`stock-badge ${stockStatus}`}>
                        {item.stock} {item.stock === 0 ? '(Out)' : ''}
                      </span>
                    </td>
                    <td className="font-semibold text-emerald">
                      ₹{totalItemValuation}
                    </td>
                    <td>{item.batchNumber || 'N/A'}</td>
                    <td>
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-action">Edit</button>
                        <button
                          className="delete-action"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Shared Add Modal */}
      {isModalOpen && (
        <AddMedicineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchMedicines}
        />
      )}
    </div>
  );
};

export default AdminInventory;