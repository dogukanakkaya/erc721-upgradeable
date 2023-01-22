import '@openzeppelin/hardhat-upgrades';
import * as dotenv from 'dotenv';
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const { PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'polygon_mumbai',
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',//'https://rpc-mumbai.maticvigil.com',
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  paths: {
    artifacts: '../artifacts'
  }
};

export default config;
