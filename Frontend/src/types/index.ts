export interface User {
  wallet_address: string;
  display_name?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_wallet: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  status: 'open' | 'escrow' | 'sold';
  created_at: string;
}

export interface ListingCreate {
  title: string;
  description: string;
  price: number;
  image_url?: string;
  seller_wallet: string;
}

export interface Escrow {
  id: string;
  listing_id: string;
  buyer_wallet: string;
  seller_wallet: string;
  status: 'pending' | 'completed';
  tx_hash?: string;
  created_at: string;
}

export interface Badge {
  id: string;
  user_wallet: string;
  type: 'buyer' | 'seller';
  metadata: {
    listing_id: string;
  };
  minted_at: string;
}

export interface Profile {
  wallet: string;
  badges: Badge[];
  completed_trades: number;
}