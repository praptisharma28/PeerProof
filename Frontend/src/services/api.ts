import { User, Listing, ListingCreate, Escrow, Profile } from '../types';

const API_BASE = 'http://localhost:8000'; // Adjust based on your FastAPI server

// Mock data for development
const mockListings: Listing[] = [
  {
    id: '1',
    seller_wallet: '0x1234567890abcdef',
    title: 'Vintage MacBook Pro',
    description: 'A well-maintained 2019 MacBook Pro 16" with excellent performance for creative work.',
    price: 1200,
    image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    status: 'open',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    seller_wallet: '0xabcdef1234567890',
    title: 'iPhone 14 Pro',
    description: 'Brand new iPhone 14 Pro in Space Black. Unlocked and ready to use.',
    price: 800,
    image_url: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    status: 'open',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    seller_wallet: '0x9876543210fedcba',
    title: 'Gaming Setup Complete',
    description: 'High-end gaming PC with RTX 4080, 32GB RAM, and ultrawide monitor included.',
    price: 2500,
    image_url: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    status: 'open',
    created_at: new Date().toISOString(),
  },
];

export const api = {
  // Auth
  login: async (user: User): Promise<{ msg: string; user: User }> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ msg: 'Login successful', user });
      }, 1000);
    });
  },

  // Listings
  getListings: async (): Promise<Listing[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockListings);
      }, 800);
    });
  },

  getListing: async (id: string): Promise<Listing> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const listing = mockListings.find(l => l.id === id);
        if (listing) {
          resolve(listing);
        } else {
          reject(new Error('Listing not found'));
        }
      }, 500);
    });
  },

  createListing: async (listing: ListingCreate): Promise<Listing> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newListing: Listing = {
          id: Date.now().toString(),
          ...listing,
          status: 'open',
          created_at: new Date().toISOString(),
        };
        mockListings.push(newListing);
        resolve(newListing);
      }, 1000);
    });
  },

  // Buy & Escrow
  buyListing: async (listingId: string, buyerWallet: string): Promise<Escrow> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const listing = mockListings.find(l => l.id === listingId);
        const escrow: Escrow = {
          id: Date.now().toString(),
          listing_id: listingId,
          buyer_wallet: buyerWallet,
          seller_wallet: listing?.seller_wallet || '',
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        resolve(escrow);
      }, 1000);
    });
  },

  confirmDelivery: async (escrowId: string, confirmerWallet: string): Promise<{ msg: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ msg: 'Delivery confirmed, NFTs minted' });
      }, 1000);
    });
  },

  // Profile
  getProfile: async (walletAddress: string): Promise<Profile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          wallet: walletAddress,
          badges: [
            {
              id: '1',
              user_wallet: walletAddress,
              type: 'buyer',
              metadata: { listing_id: '1' },
              minted_at: new Date().toISOString(),
            },
            {
              id: '2',
              user_wallet: walletAddress,
              type: 'seller',
              metadata: { listing_id: '2' },
              minted_at: new Date().toISOString(),
            },
          ],
          completed_trades: 2,
        });
      }, 800);
    });
  },
};