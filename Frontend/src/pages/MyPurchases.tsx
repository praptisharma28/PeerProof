import React from 'react';
import { ShoppingBag, Clock, CheckCircle } from 'lucide-react';

const MyPurchases: React.FC = () => {
  const mockPurchases = [
    {
      id: '1',
      title: 'Vintage MacBook Pro',
      price: 1200,
      status: 'completed',
      date: '2024-01-15',
      escrow_id: 'esc_123',
      image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    },
    {
      id: '2',
      title: 'iPhone 14 Pro',
      price: 800,
      status: 'pending',
      date: '2024-01-20',
      escrow_id: 'esc_456',
      image_url: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ShoppingBag className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold text-light/90">My Purchases</h1>
      </div>

      {mockPurchases.length > 0 ? (
        <div className="space-y-4">
          {mockPurchases.map((purchase) => (
            <div key={purchase.id} className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-6">
                <img
                  src={purchase.image_url}
                  alt={purchase.title}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-light/90">{purchase.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}>
                      {purchase.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(purchase.status)}
                        <span className="text-sm text-light/60">
                          {purchase.status === 'completed' ? 'Delivered' : 'Awaiting Delivery'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(purchase.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-light/90">
                        ${purchase.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Escrow: {purchase.escrow_id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No purchases yet</div>
          <p className="text-gray-400">Your purchase history will appear here</p>
        </div>
      )}
    </div>
  );
};

export default MyPurchases;