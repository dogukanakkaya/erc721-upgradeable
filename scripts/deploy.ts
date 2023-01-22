import { ethers, upgrades } from "hardhat";

const contractAddress = '0x9Ce46a9ef8e19D19973c27814a6180ac7a591883';
const contractName = 'MyNFTV2';

async function main() {
  // deploy a new contract
  // const MyNFT = await ethers.getContractFactory(contractName);
  // const myNFT = await upgrades.deployProxy(MyNFT);
  // await myNFT.deployed();

  // const myNFT = await ethers.getContractAt(contractName, contractAddress);

  // upgrade the contract in `contractAddress`
  const MyNFT = await ethers.getContractFactory(contractName);
  const myNFT = await upgrades.upgradeProxy(contractAddress, MyNFT);
  await myNFT.deployed();

  console.log(`MyNFT deployed to ${myNFT.address}`);

  // try to mint the item with required fee
  try {
    const tx = await myNFT.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00005') });
    const result = await tx.wait();
  } catch (err: any) {
    console.log(err.reason);
  }

  // get the latest token id that is minted
  console.log(await getLatestTokenId(contractName, myNFT.address));

  // try to get the next token id which is only available in v2
  try {
    console.log(await getNextTokenId(contractName, myNFT.address));
  } catch (_) {
    console.log(`getNextTokenId function is not defined in ${contractName} version.`);
  }
}

async function getLatestTokenId(name: string, address: string) {
  const myNFT = await ethers.getContractAt(name, address);
  return myNFT.latestTokenId();
}

async function getNextTokenId(name: string, address: string) {
  const myNFT = await ethers.getContractAt(name, address);
  return myNFT.nextTokenId();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
