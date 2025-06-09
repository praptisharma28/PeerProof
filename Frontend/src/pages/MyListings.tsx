import React, { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Listing } from '../types';

const MyListings: React.FC = () => {
  const { user } = useApp();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMyListings();
    }
  }, [user]);

  const loadMyListings = async () => {
    try {
      setIsLoading(true);
      const allListings = await api.getListings();
      const userListings = allListings.filter(listing => listing.seller_wallet === user?.wallet_address);
      setMyListings(userListings);
    } catch (error) {
      console.error('Failed to load my listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 w-48 rounded mb-6"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/60 rounded-2xl p-6">
              <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold text-light/90">My Listings</h1>
        </div>
        
        <Link
          to="/create"
          className="bg-gradient-to-r from-secondary to-accent text-black font-semibold py-3 px-6 rounded-xl hover:from-secondary/50 hover:to-accent/50 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Listing</span>
        </Link>
      </div>

      {myListings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No listings yet</div>
          <p className="text-gray-400 mb-6">Start selling by creating your first listing</p>
          <Link
            to="/create"
            className="bg-gradient-to-r from-secondary to-accent text-black font-semibold py-3 px-6 rounded-xl hover:from-secondary/50 hover:to-accent/50 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Listing</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyListings;