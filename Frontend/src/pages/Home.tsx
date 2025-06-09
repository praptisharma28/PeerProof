import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { listings, setListings, isLoading, setIsLoading } = useApp();

  useEffect(() => {
    loadFeaturedListings();
  }, []);

  const loadFeaturedListings = async () => {
    try {
      setIsLoading(true);
      const data = await api.getListings();
      setListings(data.slice(0, 3)); // Show only first 3 as featured
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-light mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            PeerProof
          </span>
        </h1>
        <p className="text-xl text-light/60 mb-8 max-w-3xl mx-auto">
          The first decentralized marketplace with NFT badges for every completed trade. 
          Buy and sell with confidence, earn reputation, and build your trading legacy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/listings"
            className="bg-gradient-to-r from-secondary to-accent text-black font-semibold py-3 px-8 rounded-xl hover:from-secondary hover:to-accent transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Browse Listings</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/create"
            className="bg-white text-gray-700 font-semibold py-3 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Start Selling
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-light/90 mb-4">Secure Escrow</h3>
          <p className="text-light/60">
            All transactions are secured by smart contract escrow, ensuring both buyers and sellers are protected.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-light/90 mb-4">NFT Badges</h3>
          <p className="text-light/60">
            Earn unique NFT badges for every completed trade. Build your reputation and showcase your trading history.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-light/90 mb-4">Growing Market</h3>
          <p className="text-light/60">
            Join a thriving decentralized marketplace with growing opportunities for buyers and sellers.
          </p>
        </div>
      </div>

      {/* Featured Listings */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-light/90">Featured Listings</h2>
          <Link
            to="/listings"
            className="text-accent hover:text-secondary font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/60 rounded-2xl p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;