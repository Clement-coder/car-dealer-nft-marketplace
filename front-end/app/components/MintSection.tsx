'use client';

import { useState } from 'react';
import { Car, Plus, Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MintSection({ addCar }) {
  const [formData, setFormData] = useState({ name: '', model: '', year: '', price: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({ name: false, model: false, year: false, price: false, image: false });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: false });
    }
  };

  const validate = () => {
    const newErrors = {
      name: !formData.name,
      model: !formData.model,
      year: !formData.year,
      price: !formData.price,
      image: !image,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleMint = () => {
    if (validate()) {
      const newCar = {
        id: Date.now(),
        ...formData,
        image: imagePreview,
      };
      addCar(newCar);
    }
  };

  const shake = {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen pt-24 md:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Mint Your Car NFT</h1>
          <p className="text-gray-300">List your car on the blockchain marketplace</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-6">
            <motion.div animate={errors.name ? shake : {}}>
              <label className="text-white font-medium mb-2 block">Car Name</label>
              <input
                type="text"
                placeholder="e.g., Tesla Model S"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: false });
                }}
                className={`w-full bg-white/5 outline-none border border-white/20 text-white rounded-lg p-3 placeholder:text-gray-400 ${errors.name ? 'border-red-500' : ''}`}
              />
            </motion.div>

            <motion.div animate={errors.model ? shake : {}}>
              <label className="text-white font-medium mb-2 block">Model</label>
              <input
                type="text"
                placeholder="e.g., Model S"
                value={formData.model}
                onChange={(e) => {
                  setFormData({ ...formData, model: e.target.value });
                  if (errors.model) setErrors({ ...errors, model: false });
                }}
                className={`w-full bg-white/5 outline-none border border-white/20 text-white rounded-lg p-3 placeholder:text-gray-400 ${errors.model ? 'border-red-500' : ''}`}
              />
            </motion.div>

            <motion.div animate={errors.year ? shake : {}}>
              <label className="text-white font-medium mb-2 block">Year</label>
              <input
                type="text"
                placeholder="e.g., 2024"
                value={formData.year}
                onChange={(e) => {
                  setFormData({ ...formData, year: e.target.value });
                  if (errors.year) setErrors({ ...errors, year: false });
                }}
                className={`w-full bg-white/5 border outline-none border-white/20 text-white rounded-lg p-3 placeholder:text-gray-400 ${errors.year ? 'border-red-500' : ''}`}
              />
            </motion.div>

            <motion.div animate={errors.price ? shake : {}}>
              <label className="text-white font-medium mb-2 block">Price (ETH)</label>
              <input
                type="text"
                placeholder="e.g., 1.5"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  if (errors.price) setErrors({ ...errors, price: false });
                }}
                className={`w-full bg-white/5 outline-none border border-white/20 text-white rounded-lg p-3 placeholder:text-gray-400 ${errors.price ? 'border-red-500' : ''}`}
              />
            </motion.div>

            <div>
              <label className="text-white font-medium mb-2 block">Image</label>
              <motion.div animate={errors.image ? shake : {}} className={`relative w-full h-48 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center ${errors.image ? 'border-red-500' : ''}`}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Car preview" className="h-full w-full object-cover rounded-lg" />
                    <button 
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-400">Click to upload an image</p>
                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </motion.div>
            </div>

            <button 
              onClick={handleMint}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" />
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
