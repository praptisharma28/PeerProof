import { User, Listing, ListingCreate, Escrow, Profile } from "../types";

const API_BASE = "http://127.0.0.1:8000";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
};

// Define Purchase type
export interface Purchase {
  id: string;
  title: string;
  price: number;
  status: "pending" | "completed" | "escrow";
  date: string;
  escrow_id: string;
  image_url: string;
  listing_id: string;
  seller_wallet: string;
  description?: string;
}

export const api = {
  // Auth
  login: async (user: User): Promise<{ msg: string; user: User }> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  },

  // Listings
  getListings: async (): Promise<Listing[]> => {
    const response = await fetch(`${API_BASE}/listings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  getListing: async (id: string): Promise<Listing> => {
    // Note: This endpoint might need to be implemented on the backend
    // or we can filter from getListings() result
    const listings = await api.getListings();
    const listing = listings.find((l) => l.id === id);
    if (!listing) {
      throw new Error("Listing not found");
    }
    return listing;
  },

  createListing: async (listing: ListingCreate): Promise<Listing> => {
    const response = await fetch(`${API_BASE}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    });
    return handleResponse(response);
  },

  getMyListings: async (walletAddress: string): Promise<Listing[]> => {
    const response = await fetch(`${API_BASE}/listings/${walletAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Purchases - NEW
  getPurchases: async (walletAddress: string): Promise<Purchase[]> => {
    const response = await fetch(`${API_BASE}/purchases/${walletAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Escrow details - NEW
  getEscrowDetails: async (
    escrowId: string
  ): Promise<Escrow & { listing?: Listing }> => {
    const response = await fetch(`${API_BASE}/escrow/${escrowId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Buy & Escrow
  buyListing: async (
    listingId: string,
    buyerWallet: string
  ): Promise<Escrow> => {
    const response = await fetch(`${API_BASE}/buy/${listingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ buyer_wallet: buyerWallet }),
    });
    return handleResponse(response);
  },

  confirmDelivery: async (
    escrowId: string,
    confirmerWallet: string
  ): Promise<{ msg: string }> => {
    const response = await fetch(`${API_BASE}/confirm/${escrowId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ confirmer_wallet: confirmerWallet }),
    });
    return handleResponse(response);
  },

  // Profile
  getProfile: async (walletAddress: string): Promise<Profile> => {
    const response = await fetch(`${API_BASE}/profile/${walletAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Payment
  generatePayUrl: async (
    listingId: string,
    paymentData: { buyer_wallet: string }
  ): Promise<{ pay_url: string }> => {
    const response = await fetch(`${API_BASE}/generate-pay-url/${listingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },

  verifyPayment: async (
    listingId: string,
    paymentData: { transaction_id?: string; buyer_wallet: string }
  ): Promise<{ msg: string; verified: boolean }> => {
    const response = await fetch(`${API_BASE}/verify-payment/${listingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },

  // Home endpoint (if needed)
  getHome: async (): Promise<unknown> => {
    const response = await fetch(`${API_BASE}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },
};
