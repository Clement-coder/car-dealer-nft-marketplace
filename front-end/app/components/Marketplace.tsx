'use client';

import { useState } from 'react';
import { DollarSign, ShoppingCart, Trash2, XCircle, BadgeCheck } from 'lucide-react';

const CarStatus = {
  AVAILABLE: 'AVAILABLE',
  SOLD: 'SOLD',
  PENDING: 'PENDING',
};

export default function Marketplace({ cars }) {
  const [carList, setCarList] = useState(
    cars.map((car) => ({ ...car, status: car.status || CarStatus.AVAILABLE }))
  );
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = carList.filter((car) => {
    const query = searchQuery.toLowerCase();
    return (
      car.name.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.status.toLowerCase().includes(query)
    );
  });

  // Delete handlers
  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCarList(carList.filter((c) => c.id !== selectedCar.id));
    setShowDeleteModal(false);
    setSelectedCar(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCar(null);
  };

  // 🛒 Buy Handlers
  const handleBuyClick = (car) => {
    setSelectedCar(car);
    setShowBuyModal(true);
  };

  const confirmPurchase = () => {
    setCarList(
      carList.map((c) =>
        c.id === selectedCar.id ? { ...c, status: CarStatus.SOLD } : c
      )
    );
    setShowBuyModal(false);
    setShowSuccessModal(true);

    // Auto-close success modal after 2s
    setTimeout(() => {
      setShowSuccessModal(false);
      setSelectedCar(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Search */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Search Cars</h2>
          <input
            type="text"
            placeholder="Search by name, model, or status..."
            className="w-full bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                    car.status === CarStatus.SOLD
                      ? 'bg-red-600 text-white'
                      : car.status === CarStatus.PENDING
                      ? 'bg-yellow-500 text-black'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {car.status}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{car.model}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-5 w-5 text-cyan-400" />
                    <span className="text-2xl font-bold text-white">{car.price}</span>
                    <span className="text-gray-400 text-sm">ETH</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleBuyClick(car)}
                    disabled={car.status === CarStatus.SOLD}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center font-bold transition-all ${
                      car.status === CarStatus.SOLD
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {car.status === CarStatus.SOLD ? 'Sold Out' : 'Buy Now'}
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

        {/* 🧾 Buy Confirmation Modal */}
        {showBuyModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full text-center text-white shadow-2xl">
              <DollarSign className="mx-auto h-12 w-12 text-cyan-400 mb-3" />
              <h2 className="text-xl font-bold mb-2">Confirm Purchase</h2>
              <p className="text-gray-300 mb-6">
                You are about to buy <span className="font-bold">{selectedCar?.name}</span> (
                {selectedCar?.model}) for <span className="font-bold">{selectedCar?.price} ETH</span>.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all"
                >
                  Confirm Buy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full text-center text-white shadow-2xl">
              <BadgeCheck className="mx-auto h-12 w-12 text-green-400 mb-3" />
              <h2 className="text-xl font-bold mb-2">Purchase Successful!</h2>
              <p className="text-gray-300">You now own {selectedCar?.name}. 🎉</p>
            </div>
          </div>
        )}

        {/* ❌ Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full text-center text-white shadow-2xl">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
              <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
              <p className="text-gray-300 mb-6">
                Do you really want to delete{' '}
                <span className="font-bold">{selectedCar?.name}</span>? This action cannot be undone.
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
