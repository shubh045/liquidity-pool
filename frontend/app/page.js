"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPool from "./artifacts/contracts/Liquidity.sol/LiquidityPool.json";
import ERC20 from "./artifacts/contracts/ERC20.sol/ERC_20.json";
import Link from "next/link";
import Form from "./components/Form";

export default function Home() {
  // const [RBNT, setRBNT] = useState("");
  // const [SHUBH, setSHUBH] = useState("");
  const [token, setToken] = useState({ RBNT: "", SHUBH: "" });
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [RBNTContract, setRBNTContract] = useState(null);
  const [SHUBHContract, setSHUBHContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [reserve, setReserve] = useState({ reserve0: 0, reserve1: 0 });
  const contractAddress = "0xed6A230eB12C10301679bFA6CF6DF676dAcc732C";

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wallet = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // const contractAddress = "0xcC680Ce60E640F8BEF955AC5fDe00F4700DC97D3";
        const RBNTAddress = "0x29bE3995cf26De8457Ef502785744440a9614C40";
        const SHUBHAddress = "0xFc36403DD30f7d96565288c1e264be67062214cE";
        const contract = new ethers.Contract(
          contractAddress,
          LiquidityPool.abi,
          signer
        );

        const rbntContract = new ethers.Contract(
          RBNTAddress,
          ERC20.abi,
          signer
        );
        const shubhContract = new ethers.Contract(
          SHUBHAddress,
          ERC20.abi,
          signer
        );
        setContract(contract);
        setRBNTContract(rbntContract);
        setSHUBHContract(shubhContract);
        setProvider(signer);
      } else {
        alert("Metamask is not installed.");
      }
    };

    provider && wallet();
  }, []);

  useEffect(() => {
    const reserves = async () => {
      if (contract) {
        const reserve0 = await contract.reserveRBNT();
        const reserve1 = await contract.reserveSHUBH();

        setReserve((prev) => ({
          ...prev,
          reserve0: reserve0,
          reserve1: reserve1,
        }));
      }
    };

    reserves();
  }, [contract, reserve.reserve0, reserve.reserve1]);

  const addLiquidity = async (amount) => {
    // const amount = ethers.utils.parseEther("0.01")
    await RBNTContract.approve(
      contractAddress,
      amount
    );
    await SHUBHContract.approve(
      contractAddress,
      amount
    );
    await contract.addLiquidity(amount, amount);

    const reserve0 = await contract.reserveRBNT();
    const reserve1 = await contract.reserveSHUBH();

    setReserve((prev) => ({ ...prev, reserve0: reserve0, reserve1: reserve1 }));
  };

  const handleRBNTChange = async (e) => {
    const reserve0 = reserve.reserve0 * 100;
    const reserve1 = reserve.reserve1 * 100;
    const amountWithFee = (e.target.value * 997) / 1000;
    setToken((prev) => ({
      ...prev,
      RBNT: e.target.value,
      // SHUBH: (ethers.utils.formatEther(ethers.utils.parseEther(e.target.value)) * 997) / 1000
      SHUBH: (reserve1 * amountWithFee) / (reserve0 + amountWithFee),
    }));
  };

  const swap = async () => {
    // await addLiquidity(token.RBNT * 100);
    // await contract._approves1(ethers.utils.parseEther(token.RBNT));
    // await contract.RBNT.approve(contract, token.RBNT);
    // const sep_provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_TESTNET_RPC_URL);
    // console.log(contract);
    const amount = token.RBNT * 100
    const approval = await RBNTContract.approve(
      contractAddress,
      amount
    );
    await approval.wait();
    await contract.exchange(amount);
  };

  return (
    <>
      {/* <Link href={{pathname: '/add-liquidity', query: {contract: contract}}}>Add liquidity</Link> */}
      <Form
        token={token}
        onChange={handleRBNTChange}
        onClick={swap}
        val="Swap"
      />
    </>
  );
}
