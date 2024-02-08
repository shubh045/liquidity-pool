// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  //"0x3f51F969D2A72A2Da9C4D80337cB863da0dEd218",
  // const signer = await hre.ethers.getSigners();
  const liquidity = await hre.ethers.deployContract("LiquidityPool",
    ["0x29bE3995cf26De8457Ef502785744440a9614C40","0xFc36403DD30f7d96565288c1e264be67062214cE"]
  );

  await liquidity.waitForDeployment();
  console.log("Liquidity contract deployed at address: ", await liquidity.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0