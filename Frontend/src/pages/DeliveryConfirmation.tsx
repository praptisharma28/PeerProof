import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Package, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Escrow } from '../types';

const DeliveryConfirmation: React.FC = () => {
  const { escrowId } = useParams<{ escrowId: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (escrowId) {
      loadEscrow();
    }
  }, [escrowId]);

  const loadEscrow = async () => {
    try {
      setIsLoading(true);
      // Mock escrow data since we don't have the API endpoint implemented
      const mockEscrow: Escrow = {
        id: escrowId!,
        listing_id: '1',
        buyer_wallet: user?.wallet_address || '',
        seller_wallet: '0x1234567890abcdef',
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      setEscrow(mockEscrow);
    } catch (error) {
      console.error('Failed to load escrow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!escrow || !user) return;

    try {
      setIsConfirming(true);
      await api.confirmDelivery(escrow.id, user.wallet_address);
      setEscrow({ ...escrow, status: 'completed' });
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-2xl mx-auto">
        <div className="bg-gray-200 h-8 w-64 rounded mb-6"></div>
        <div className="bg-gray-200 h-64 w-full rounded-2xl"></div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Escrow not found</div>
      </div>
    );
  }

  const isCompleted = escrow.status === 'completed';
  const canConfirm = escrow.buyer_wallet === user?.wallet_address && !isCompleted;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-light/90 mb-2">
          {isCompleted ? 'Delivery Confirmed' : 'Awaiting Delivery Confirmation'}
        </h1>
        <p className="text-light/60">
          {isCompleted 
            ? 'This transaction has been completed and NFT badges have been minted.'
            : 'Please confirm once you have received your item to complete the transaction.'
          }
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isCompleted ? 'bg-emerald-100' : 'bg-yellow-100'
          }`}>
            {isCompleted ? (
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            ) : (
              <Clock className="h-10 w-10 text-yellow-600" />
            )}
          </div>
          
          <div className={`text-lg font-semibold mb-2 ${
            isCompleted ? 'text-emerald-800' : 'text-yellow-800'
          }`}>
            {isCompleted ? 'Transaction Completed' : 'Waiting for Confirmation'}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="text-light/60">Escrow ID</span>
            </div>
            <span className="font-mono text-sm">{escrow.id}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-light/60">Buyer</span>
            </div>
            <span className="font-mono text-sm">
              {escrow.buyer_wallet.slice(0, 6)}...{escrow.buyer_wallet.slice(-4)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-light/60">Seller</span>
            </div>
            <span className="font-mono text-sm">
              {escrow.seller_wallet.slice(0, 6)}...{escrow.seller_wallet.slice(-4)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-light/60">Created</span>
            </div>
            <span className="text-sm">
              {new Date(escrow.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {isCompleted ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                Transaction Complete!
              </h3>
              <p className="text-emerald-700 text-sm">
                NFT badges have been minted for both buyer and seller. 
                Check your profile to view your new trading badges.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex-1 bg-gradient-to-r from-secondary to-accent text-black font-semibold py-3 px-6 rounded-xl hover:from-secondary/50 hover:to-accent/50 transition-all duration-200"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/listings')}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse More
              </button>
            </div>
          </div>
        ) : canConfirm ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <Package className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Have you received your item?
              </h3>
              <p className="text-yellow-700 text-sm">
                Only confirm delivery once you have received and inspected your purchase. 
                This action cannot be undone.
              </p>
            </div>
            
            <button
              onClick={handleConfirmDelivery}
              disabled={isConfirming}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isConfirming ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirm Delivery</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Waiting for Buyer Confirmation
            </h3>
            <p className="text-light/60 text-sm">
              The buyer will confirm delivery once they receive the item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryConfirmation;