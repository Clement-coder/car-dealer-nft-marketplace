'use client';

import { DollarSign, ShoppingCart } from 'lucide-react';

export default function Marketplace({ cars }) {
  return (
    <div className="min-h-screen pt-24 md:pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-300 text-lg">Browse and purchase premium car NFTs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/20 transition-all hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-cyan-500 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-bold">{car.year}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-5 w-5 text-cyan-400" />
                    <span className="text-2xl font-bold text-white">{car.price}</span>
                    <span className="text-gray-400 text-sm">ETH</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
