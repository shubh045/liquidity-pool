// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const liquidity = await hre.ethers.deployContract("LiquidityPool",
    ["0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8","0xd9145CCE52D386f254917e481eB44e9943F39138"]
  );

  await liquidity.waitForDeployment();
  console.log("Contract deployed at address: ", await liquidity.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0