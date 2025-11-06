import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CarDealerModule", (m) => {
  const carDealer = m.contract("CarDealer");


  return { carDealer };
});
