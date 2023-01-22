import { ethers, upgrades } from "hardhat";

const contractName = 'MyNFTV2';

async function main() {
  // deploy a new contract
  const MyNFTV1 = await ethers.getContractFactory('MyNFTV1');
  const myNFTv1 = await upgrades.deployProxy(MyNFTV1);
  await myNFTv1.deployed();

  try {
    console.log(await myNFTv1.nextTokenId());
  } catch (_) {
    console.log(`nextTokenId function is not defined in version 1.`);
  }

  try {
    await myNFTv1.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00001') });
  } catch (err: any) {
    console.log(err.reason);
  }

  // upgrade the
  const MyNFT = await ethers.getContractFactory(contractName);
  const myNFT = await upgrades.upgradeProxy(myNFTv1.address, MyNFT);
  await myNFT.deployed();

  console.log(`MyNFT deployed to ${myNFT.address}`);

  // try to mint the item with required fee
  try {
    await myNFT.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00005') });
  } catch (err: any) {
    console.log(err.reason);
  }

  console.log(await myNFT.latestTokenId());
  console.log(await myNFT.nextTokenId());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
