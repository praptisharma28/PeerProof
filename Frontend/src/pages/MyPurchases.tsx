import React, { useState, useEffect } from "react";
import { ShoppingBag, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { api, Purchase } from "../services/api";
import { useApp } from "../context/AppContext";

interface MyPurchasesProps {
  walletAddress?: string;
}

const MyPurchases: React.FC<MyPurchasesProps> = () => {
  const { user } = useApp();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const walletAddress = user?.wallet_address;

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!walletAddress) {
        setError("Wallet address is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.getPurchases(walletAddress);
        setPurchases(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
        setError("Failed to load purchases. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [walletAddress]);

  const handleConfirmDelivery = async (escrowId: string) => {
    if (!walletAddress) return;

    try {
      await api.confirmDelivery(escrowId, walletAddress);
      // Refresh the purchases after confirmation
      const updatedPurchases = await api.getPurchases(walletAddress);
      setPurchases(updatedPurchases);
    } catch (err) {
      console.error("Failed to confirm delivery:", err);
      alert("Failed to confirm delivery. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "pending":
      case "escrow":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
      case "escrow":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Delivered";
      case "escrow":
        return "In Escrow - Awaiting Delivery";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold text-light/90">My Purchases</h1>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold text-light/90">My Purchases</h1>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 text-lg mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-secondary hover:text-secondary/80 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ShoppingBag className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold text-light/90">My Purchases</h1>
      </div>

      {purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center space-x-6">
                <img
                  src={
                    purchase.image_url ||
                    "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg"
                  }
                  alt={purchase.title}
                  className="w-20 h-20 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg";
                  }}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-light/90">
                      {purchase.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        purchase.status
                      )}`}
                    >
                      {purchase.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(purchase.status)}
                        <span className="text-sm text-light/60">
                          {getStatusText(purchase.status)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(purchase.date)}
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

                  {/* Confirm Delivery Button for escrow status */}
                  {purchase.status === "escrow" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() =>
                          handleConfirmDelivery(purchase.escrow_id)
                        }
                        className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Confirm Delivery
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No purchases yet</div>
          <p className="text-gray-400">
            Your purchase history will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
