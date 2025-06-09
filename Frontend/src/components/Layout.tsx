import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  Plus, 
  ShoppingBag, 
  Package, 
  User, 
  LogOut,
  Wallet
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, setUser } = useApp();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Listings', href: '/listings', icon: List },
    { name: 'Create', href: '/create', icon: Plus },
    { name: 'My Purchases', href: '/purchases', icon: ShoppingBag },
    { name: 'My Listings', href: '/my-listings', icon: Package },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-background backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                PeerProof
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-light/60">
                {user.display_name} ({user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)})
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-background backdrop-blur-md border-r border-white/20 min-h-screen sticky top-16">
          <div className="p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-accent text-black shadow-lg'
                          : 'text-light/60 hover:bg-white/10 hover:text-light/90'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;