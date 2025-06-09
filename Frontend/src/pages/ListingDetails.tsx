import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, User, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Listing } from '../types';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (id) {
      loadListing(id);
    }
  }, [id]);

  const loadListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const data = await api.getListing(listingId);
      setListing(data);
    } catch (error) {
      console.error('Failed to load listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!listing || !user) return;

    try {
      setIsBuying(true);
      const escrow = await api.buyListing(listing.id, user.wallet_address);
      navigate(`/delivery-confirmation/${escrow.id}`);
    } catch (error) {
      console.error('Failed to buy listing:', error);
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 w-32 rounded mb-6"></div>
        <div className="bg-gray-200 h-96 w-full rounded-2xl mb-6"></div>
        <div className="bg-gray-200 h-6 w-3/4 rounded mb-4"></div>
        <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
        <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Listing not found</div>
      </div>
    );
  }

  const isOwner = user?.wallet_address === listing.seller_wallet;
  const canBuy = listing.status === 'open' && !isOwner;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-light/60 hover:text-light/90 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={listing.image_url || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg'}
              alt={listing.title}
              className="w-full h-96 md:h-full object-cover"
            />
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                listing.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                listing.status === 'escrow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {listing.status.toUpperCase()}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(listing.created_at).toLocaleDateString()}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-light/90 mb-4">{listing.title}</h1>
            
            <div className="flex items-center text-4xl font-bold text-light/90 mb-6">
              <DollarSign className="h-8 w-8 text-emerald-600" />
              {listing.price.toLocaleString()}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-light/90 mb-2">Description</h3>
              <p className="text-light/60 leading-relaxed">{listing.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-light/90 mb-2">Seller</h3>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-light/60">
                  {listing.seller_wallet.slice(0, 6)}...{listing.seller_wallet.slice(-4)}
                </span>
              </div>
            </div>

            {canBuy && (
              <button
                onClick={handleBuy}
                disabled={isBuying}
                className="w-full bg-gradient-to-r from-secondary to-accent text-black font-semibold py-4 px-6 rounded-xl hover:from-secondary/50 hover:to-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isBuying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Buy Now</span>
                  </>
                )}
              </button>
            )}

            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-black text-sm">This is your listing</p>
              </div>
            )}

            {listing.status !== 'open' && !isOwner && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-light/60 text-sm">
                  This item is {listing.status === 'escrow' ? 'currently in escrow' : 'no longer available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;