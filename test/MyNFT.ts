import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Mynft", function () {
  let address = '';

  async function deployV1() {
    const [account] = await ethers.getSigners();

    const MyNFT = await ethers.getContractFactory("MyNFTV1");
    const myNFT = await upgrades.deployProxy(MyNFT);

    address = myNFT.address;

    return { myNFT, account };
  }

  async function deployV2() {
    const [account] = await ethers.getSigners();

    const MyNFT = await ethers.getContractFactory("MyNFTV2");
    const myNFT = await upgrades.upgradeProxy(address, MyNFT);


    return { myNFT, account };
  }

  describe("Deployment", function () {
    it("should get latest token id as 0", async function () {
      const { myNFT } = await loadFixture(deployV1);

      expect(await myNFT.latestTokenId()).to.equal(0);
    });

    it("should throw error insufficient funds", async function () {
      const { myNFT } = await loadFixture(deployV1);

      try {
        await myNFT.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.000001') })
        throw Error();
      } catch (_) {
        expect(await myNFT.latestTokenId()).to.equal(0);
      }
    });

    it("should get latest token id as 1", async function () {
      const { myNFT } = await loadFixture(deployV1);

      await myNFT.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00001') });

      expect(await myNFT.latestTokenId()).to.equal(1);
    });

    it("should throw error since there is no nextTokenId function in V1", async function () {
      const { myNFT } = await loadFixture(deployV1);

      try {
        await myNFT.nextTokenId();
        throw Error();
      } catch (_) {
        expect(true);
      }
    });
  });

  describe("Upgrade", function () {
    it("should get latest token id as 1 since we have minted in V1", async function () {
      const { myNFT: myNFTV1 } = await loadFixture(deployV1);

      await myNFTV1.mintItem('https://run.mocky.io/v3/17d6e506-17e3-4b53-a964-a7e0ed565ad0', { value: ethers.utils.parseEther('0.00001') });

      const { myNFT: myNFTV2 } = await loadFixture(deployV2);

      expect(await myNFTV2.latestTokenId()).to.equal(1);
    });

    it("should get latest token id as 1 and next token id as 2", async function () {
      const { myNFT } = await loadFixture(deployV2);

      expect(await myNFT.latestTokenId()).to.equal(1);
      expect(await myNFT.nextTokenId()).to.equal(2);
    });
  });
});
