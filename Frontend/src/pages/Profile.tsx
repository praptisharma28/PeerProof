import React, { useEffect, useState } from 'react';
import { User, Award, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Profile as ProfileType } from '../types';

const Profile: React.FC = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await api.getProfile(user!.wallet_address);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 w-32 rounded mb-6"></div>
        <div className="bg-gray-200 h-32 w-full rounded-2xl mb-6"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile || !user) {
    return <div>Profile not found</div>;
  }

  const buyerBadges = profile.badges.filter(badge => badge.type === 'buyer');
  const sellerBadges = profile.badges.filter(badge => badge.type === 'seller');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <User className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold text-light/90">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-light/90 mb-2">{user.display_name}</h2>
            <p className="text-light/60 mb-2">
              {profile.wallet.slice(0, 6)}...{profile.wallet.slice(-4)}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-light/90 mb-1">{profile.completed_trades}</div>
          <div className="text-light/60">Completed Trades</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-light/90 mb-1">{buyerBadges.length}</div>
          <div className="text-light/60">Buyer Badges</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-light/90 mb-1">{sellerBadges.length}</div>
          <div className="text-light/60">Seller Badges</div>
        </div>
      </div>

      {/* NFT Badges */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <h3 className="text-xl font-semibold text-light/90 mb-6 flex items-center">
          <Award className="h-6 w-6 mr-2 text-secondary" />
          NFT Trading Badges
        </h3>

        {profile.badges.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.badges.map((badge) => (
              <div key={badge.id} className="bg-white/20 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    badge.type === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {badge.type.toUpperCase()} BADGE
                  </span>
                  <span className="text-sm text-white">
                    {new Date(badge.minted_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-light/60">
                  Listing ID: {badge.metadata.listing_id}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500">No badges earned yet</div>
            <p className="text-gray-400 text-sm mt-1">Complete trades to earn NFT badges</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;