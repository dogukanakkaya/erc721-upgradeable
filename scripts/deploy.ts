import { ethers, upgrades } from "hardhat";

const contractName = 'MyNFTV2';

async function main() {
  // deploy a new contract
  const MyNFTV1 = await ethers.getContractFactory('MyNFTV1');
  const myNFTv1 = await upgrades.deployProxy(MyNFTV1);
  await myNFTv1.deployed();

  await myNFTv1.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00001') });

  console.log(await myNFTv1.latestTokenId());

  // upgrade the contract
  const MyNFT = await ethers.getContractFactory(contractName);
  const myNFT = await upgrades.upgradeProxy(myNFTv1.address, MyNFT);
  await myNFT.deployed();

  await myNFT.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00005') });

  console.log(await myNFT.latestTokenId());
  console.log(await myNFT.nextTokenId());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
