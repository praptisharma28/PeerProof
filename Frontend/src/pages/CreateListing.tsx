import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

const CreateListing: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
        seller_wallet: user.wallet_address,
      };
      
      const newListing = await api.createListing(listingData);
      navigate(`/listing/${newListing.id}`);
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light/90 mb-2">Create New Listing</h1>
        <p className="text-light/60">List your item for sale on the decentralized marketplace</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter a descriptive title for your item"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              placeholder="Provide detailed information about your item"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.image_url && (
            <div>
              <label className="block text-sm font-medium text-light mb-2">
                Preview
              </label>
              <div className="bg-white/10 border border-gray-300 rounded-xl overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-white/10 border border-gray-300 text-light font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-secondary to-accent text-black font-semibold py-3 px-6 rounded-xl hover:from-secondary/60 hover:to-accent/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;