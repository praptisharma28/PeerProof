import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign } from 'lucide-react';
import { Listing } from '../types';

interface ProductCardProps {
  listing: Listing;
}

const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-100 text-emerald-800';
      case 'escrow':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/listing/${listing.id}`}>
      <div className="group bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-w-16 aspect-h-12 overflow-hidden">
          <img
            src={listing.image_url || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg'}
            alt={listing.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
              {listing.status.toUpperCase()}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(listing.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-light/90 mb-2 group-hover:text-light transition-colors">
            {listing.title}
          </h3>
          
          <p className="text-light/60 text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-2xl font-bold text-light/90">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              {listing.price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {listing.seller_wallet.slice(0, 6)}...{listing.seller_wallet.slice(-4)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;