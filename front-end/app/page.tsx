'use client';

import { useState } from 'react';
import NavBar from './components/NavBar';
import MintSection from './components/MintSection';
import Marketplace from './components/Marketplace';
import WalletSection from './components/WalletSection';

export default function Home() {
  const [activeSection, setActiveSection] = useState('marketplace');
  const [cars, setCars] = useState([
    { id: 1, name: 'Tesla Model S', year: 2024, price: 1.5, image: 'https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=600' },
    { id: 2, name: 'Porsche 911', year: 2023, price: 2.8, image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 3, name: 'BMW M4', year: 2024, price: 1.9, image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ]);

  const addCar = (car) => {
    setCars([car, ...cars]);
    setActiveSection('marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-cyan-900">
      <NavBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {activeSection === 'mint' && <MintSection addCar={addCar} />}
      {activeSection === 'marketplace' && <Marketplace cars={cars} />}
      {activeSection === 'wallet' && <WalletSection />}
    </div>
  );
}
