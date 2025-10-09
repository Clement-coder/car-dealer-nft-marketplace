'use client';

import { useState } from 'react';
import { DollarSign, ShoppingCart, Trash2, XCircle } from 'lucide-react';

export default function Marketplace({ cars }) {
  const [carList, setCarList] = useState(cars);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');

  const filteredCars = carList.filter((car) => {
    const nameMatch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const modelMatch = car.model.toLowerCase().includes(modelQuery.toLowerCase());
    return nameMatch && modelMatch;
  });

  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setCarList(carList.filter((c) => c.id !== selectedCar.id));
    setShowModal(false);
    setSelectedCar(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-300 text-lg">Browse and purchase premium car NFTs</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Search Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by model..."
              className="bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Car grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/20 transition-all hover:scale-105"
            >
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

                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </button>

                  <button
                    onClick={() => handleDeleteClick(car)}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-all"
                  >
                    <Trash2 className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full text-center text-white shadow-2xl">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
              <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
              <p className="text-gray-300 mb-6">
                Do you really want to delete <span className="font-bold">{selectedCar?.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
