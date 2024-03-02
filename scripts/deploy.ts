import {ethers} from "hardhat";

async function main() {
  
  const liquidity = await ethers.deployContract("LiquidityPool",
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