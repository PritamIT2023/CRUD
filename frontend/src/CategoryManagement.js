// CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [editCategory, setEditCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/category', newCategory);
      setSuccess('Category created successfully');
      setNewCategory({ name: '' });
      fetchCategories();
    } catch (error) {
      setError('Failed to create category');
      console.error('Error:', error);
    }
  };

  // Update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/category/${editCategory.id}`, {
        name: editCategory.name,
        categoryId: editCategory.id
      });
      setSuccess('Category updated successfully');
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      setError('Failed to update category');
      console.error('Error:', error);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`/category/${categoryId}`, {
        data: { categoryId: categoryId }
      });
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      setError('Failed to delete category');
      console.error('Error:', error);
    }
  };

  return (
    <div className="category-management">
      <h1>Category Management</h1>

      {/* Error and Success Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Create Category Form */}
      <div className="create-category-form">
        <h2>Create New Category</h2>
        <form onSubmit={handleCreateCategory}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            required
          />
          <button type="submit">Create Category</button>
        </form>
      </div>

      {/* Categories List */}
      <div className="categories-list">
        <h2>Categories</h2>
        {categories.map(category => (
          <div key={category.id} className="category-item">
            {editCategory && editCategory.id === category.id ? (
              // Edit Form
              <form onSubmit={handleUpdateCategory} className="edit-form">
                <input
                  type="text"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({
                    ...editCategory,
                    name: e.target.value
                  })}
                />
                <button type="submit">Save</button>
                <button 
                  type="button" 
                  onClick={() => setEditCategory(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </form>
            ) : (
              // Display Category
              <div className="category-content">
                <span className="category-name">{category.name}</span>
                <div className="category-actions">
                  <button 
                    onClick={() => setEditCategory(category)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
