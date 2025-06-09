import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import MyPurchases from './pages/MyPurchases';
import MyListings from './pages/MyListings';
import Profile from './pages/Profile';
import DeliveryConfirmation from './pages/DeliveryConfirmation';

const AppRoutes: React.FC = () => {
  const { user } = useApp();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/purchases" element={<MyPurchases />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/delivery-confirmation/:escrowId" element={<DeliveryConfirmation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;