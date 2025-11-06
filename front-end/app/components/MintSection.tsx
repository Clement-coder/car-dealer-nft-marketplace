"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Car, Plus, X, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import CarDealerABI from "@/abi/CarDealer.json";

const CONTRACT_ADDRESS = "0x1265b2Dd36B3684bF59f1f7A0A1e22214c937710";

export default function MintSection() {
  const [formData, setFormData] = useState({ name: "", model: "", year: "", price: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");

  const { writeContract, data: hash } = useWriteContract();
  const { isSuccess, isLoading } = useWaitForTransactionReceipt({ hash });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      // (Optional) Upload to Pinata or Web3.Storage
      // For now, you can hardcode or use any uploaded IPFS URL
      setIpfsUrl("https://ipfs.io/ipfs/QmYourImageHashHere");
    }
  };

  const handleMint = async () => {
    if (!ipfsUrl) return alert("Please upload an image first!");
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CarDealerABI.abi,
        functionName: "mintCar",
        args: [formData.name, formData.model, Number(formData.year), ipfsUrl],
      });
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Mint Car NFT</h1>
        <input
          type="text"
          placeholder="Car Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Model"
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
        <input id="file-upload" type="file" onChange={handleImageChange} />

        <button
          onClick={handleMint}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          {isLoading ? "Minting..." : "Mint NFT"}
        </button>

        {isSuccess && <p className="text-green-500 mt-3">✅ Mint successful!</p>}
      </div>
    </div>
  );
}
