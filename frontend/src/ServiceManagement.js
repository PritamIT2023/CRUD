import React, { useState } from 'react';
import axios from 'axios';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    prices: []
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Fetch services for a category
  const fetchServices = async (categoryId) => {
    try {
      const response = await axios.get(`/category/${categoryId}/services`);
      setServices(response.data.services);
      setPrices(response.data.prices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Create new service
  const createService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/category/${selectedCategoryId}/service`, newService);
      fetchServices(selectedCategoryId);
      setNewService({ name: '', prices: [] });
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  // Delete service
  const deleteService = async (serviceId) => {
    try {
      await axios.delete(`/category/${selectedCategoryId}/service/${serviceId}`);
      fetchServices(selectedCategoryId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  // Update service
  const updateService = async (serviceId, updatedPrices) => {
    try {
      await axios.put(`/category/${selectedCategoryId}/service/${serviceId}`, {
        prices: updatedPrices
      });
      fetchServices(selectedCategoryId);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  // Add price to new service
  const addPrice = () => {
    setNewService(prev => ({
      ...prev,
      prices: [...prev.prices, { amount: '', duration: '' }]
    }));
  };

  // Update price in new service form
  const updateNewServicePrice = (index, field, value) => {
    const updatedPrices = [...newService.prices];
    updatedPrices[index][field] = value;
    setNewService(prev => ({
      ...prev,
      prices: updatedPrices
    }));
  };

  return (
    <div className="container">
      <h1>Service Management</h1>
      
      {/* Category Selection */}
      <div className="category-selection">
        <input
          type="text"
          placeholder="Enter Category ID"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        />
        <button onClick={() => fetchServices(selectedCategoryId)}>
          Load Services
        </button>
      </div>

      {/* Create New Service Form */}
      <div className="create-service-form">
        <h2>Create New Service</h2>
        <form onSubmit={createService}>
          <input
            type="text"
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) => setNewService(prev => ({...prev, name: e.target.value}))}
          />
          
          {newService.prices.map((price, index) => (
            <div key={index} className="price-input">
              <input
                type="number"
                placeholder="Amount"
                value={price.amount}
                onChange={(e) => updateNewServicePrice(index, 'amount', e.target.value)}
              />
              <input
                type="text"
                placeholder="Duration"
                value={price.duration}
                onChange={(e) => updateNewServicePrice(index, 'duration', e.target.value)}
              />
            </div>
          ))}
          
          <button type="button" onClick={addPrice}>Add Price Option</button>
          <button type="submit">Create Service</button>
        </form>
      </div>

      {/* Services List */}
      <div className="services-list">
        <h2>Services</h2>
        {services.map(service => (
          <div key={service.id} className="service-item">
            <h3>{service.name}</h3>
            <div className="prices">
              {prices
                .filter(price => price.serviceId === service.id)
                .map(price => (
                  <div key={price.id} className="price-item">
                    <span>Amount: {price.amount}</span>
                    <span>Duration: {price.duration}</span>
                  </div>
                ))}
            </div>
            <button onClick={() => deleteService(service.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManagement;
