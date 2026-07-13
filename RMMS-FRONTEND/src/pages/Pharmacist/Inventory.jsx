import { useState, useEffect } from 'react';
import API from '../../services/api';
import AddMedicineModal from '../../componets/Modals/AddMedicineModal';
import './Inventory.css';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch medicines from Backend API
  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Filter logic for Search and Category
  const filteredMedicines = medicines.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // KPI Calculations
  const totalItems = medicines.length;
  const lowStockCount = medicines.filter((m) => m.stock > 0 && m.stock <= 10).length;
  const outOfStockCount = medicines.filter((m) => m.stock === 0).length;

  return (
    <div className="inventory-page">
      {/* Header Bar */}
      <div className="inventory-header">
        <div>
          <h1 className="page-title">Medicine Inventory</h1>
          <p className="page-subtitle">Manage stock levels, categories, and batches</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Add New Medicine
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Medicines</span>
          <span className="kpi-value">{totalItems}</span>
        </div>
        <div className="kpi-card warning">
          <span className="kpi-label">Low Stock Alerts</span>
          <span className="kpi-value">{lowStockCount}</span>
        </div>
        <div className="kpi-card danger">
          <span className="kpi-label">Out of Stock</span>
          <span className="kpi-value">{outOfStockCount}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="inventory-toolbar">
        <input
          type="text"
          placeholder="🔍 Search medicine or batch number..."
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

      {/* Medicines Table */}
      <div className="table-card">
        {isLoading ? (
          <div className="table-loading">Loading inventory data...</div>
        ) : filteredMedicines.length === 0 ? (
          <div className="table-empty">No medicine records found.</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Batch No.</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((item) => {
                let stockStatus = 'in-stock';
                if (item.stock === 0) stockStatus = 'out-stock';
                else if (item.stock <= 10) stockStatus = 'low-stock';

                return (
                  <tr key={item._id}>
                    <td className="font-semibold">{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <span className={`stock-badge ${stockStatus}`}>
                        {item.stock} {item.stock === 0 ? '(Out)' : ''}
                      </span>
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
                        <button className="delete-action">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Integration */}
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

export default Inventory;