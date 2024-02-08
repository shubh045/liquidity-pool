"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPool from "./artifacts/contracts/Liquidity.sol/LiquidityPool.json";
import Link from "next/link";
import Form from "./components/Form";

export default function Home() {
  // const [RBNT, setRBNT] = useState("");
  // const [SHUBH, setSHUBH] = useState("");
  const [token, setToken] = useState({ RBNT: "", SHUBH: "" });
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wallet = async () => {
      if (provider) {
        await provider. send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        // const contractAddress = "0x31e034c027904c4EBB7eaf4C6A5161b8fd7A3089";
        // const contractAddress = "0x8839C1d1CA00B0D1d4B97b31A61f78292d36F262";
        // const contractAddress = "0xCF27802616518E760D51d93eF3F0985b2db653f6";
        const contractAddress = "0x91b6576cD9C117417D1cb27D461D5b1329B5ab0C";
        const contract = new ethers.Contract(
          contractAddress,
          LiquidityPool.abi,
          signer
        );
        setContract(contract);
        setProvider(signer);
      } else {
        alert("Metamask is not installed.");
      }
    };

    provider && wallet();
  }, []);

  const addLiquidity = async () => {
    const amount = ethers.utils.parseEther("0.01")
    await contract._approves(amount, amount);
    await contract.addLiquidity(amount, amount);
  }

  const handleRBNTChange = (e) => {
    setToken((prev) => ({
      ...prev,
      RBNT: e.target.value,
      // SHUBH: (ethers.utils.formatEther(ethers.utils.parseEther(e.target.value)) * 997) / 1000
      SHUBH: (e.target.value * 997) / 1000
    }));
  };


  const swap = async () => {
    // addLiquidity();
    // await contract._approves1(ethers.utils.parseEther(token.RBNT));
    // await contract.RBNT.approve(contract, token.RBNT);
    // const sep_provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_TESTNET_RPC_URL);
    // console.log(contract);
    await contract.exchange(token.RBNT);
  }

  return (
    <>
    {/* <Link href={{pathname: '/add-liquidity', query: {contract: contract}}}>Add liquidity</Link> */}
    <Form token={token} onChange={handleRBNTChange} onClick={swap} val="Swap" />
    </>
  );
}
