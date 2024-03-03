"use client";

import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPool_abi from "../artifacts/contracts/Liquidity.sol/LiquidityPool.json";
import ERC20 from "../artifacts/contracts/ERC20.sol/ERC_20.json";
import Form from "./components/Form";
import styles from "./page.module.css";
import { ERC_20, LiquidityPool } from "../typechain-types";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Tokens {
  RBNT: string;
  SHUBH: string;
}

interface Reserves {
  reserve0: number;
  reserve1: number;
}

type Provider = ethers.BrowserProvider | null;

export default function Home() {
  // const [RBNT, setRBNT] = useState("");
  // const [SHUBH, setSHUBH] = useState("");
  const [token, setToken] = useState<Tokens>({ RBNT: "", SHUBH: "" });
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<LiquidityPool | null>(null);
  const [RBNTContract, setRBNTContract] = useState<ERC_20 | null>(null);
  const [SHUBHContract, setSHUBHContract] = useState<ERC_20 | null>(null);
  // const [provider, setProvider] = useState<Provider>(null);
  const [reserve, setReserve] = useState<Reserves>({
    reserve0: 0,
    reserve1: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const contractAddress: string = "0x8021d0f7Ca1010E30f5Fc8433e5E6410857BaDC2";
  const RBNTAddress: string = "0x29bE3995cf26De8457Ef502785744440a9614C40";
  const SHUBHAddress: string = "0xFc36403DD30f7d96565288c1e264be67062214cE";

  useEffect(() => {
    const provider: Provider = new ethers.BrowserProvider(
      window.ethereum
    );
    const wallet = async (): Promise<void> => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address: string = await signer.getAddress();
        setAccount(address);

        // const contractAddress = "0xcC680Ce60E640F8BEF955AC5fDe00F4700DC97D3";
        const contract: LiquidityPool = new ethers.Contract(
          contractAddress,
          LiquidityPool_abi.abi,
          signer
        ) as unknown as LiquidityPool;

        const rbntContract: ERC_20 = new ethers.Contract(
          RBNTAddress,
          ERC20.abi,
          signer
        ) as unknown as ERC_20;
        const shubhContract: ERC_20 = new ethers.Contract(
          SHUBHAddress,
          ERC20.abi,
          signer
        ) as unknown as ERC_20;
        setContract(contract);
        setRBNTContract(rbntContract);
        setSHUBHContract(shubhContract);
        // setProvider(signer);
      } else {
        toast("Metamask is not installed.");
      }
    };

    provider && wallet();
  }, []);

  useEffect(() => {
    const reserves = async (): Promise<void> => {
      if (contract) {
        const reserve0: number = Number(await contract.reserveRBNT());
        const reserve1: number = Number(await contract.reserveSHUBH());

        setReserve((prev: Reserves) => ({
          ...prev,
          reserve0: reserve0,
          reserve1: reserve1,
        }));
      }
    };

    reserves();
  }, [contract, reserve.reserve0, reserve.reserve1]);

  const addLiquidity = async (amount: number): Promise<void> => {
    // const amount = ethers.utils.parseEther("0.01")
    await RBNTContract?.approve(contractAddress, amount);
    await SHUBHContract?.approve(contractAddress, amount);
    await contract?.addLiquidity(amount, amount);
  };

  const handleRBNTChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const reserve0: number = reserve.reserve0 * 100;
    const reserve1: number = reserve.reserve1 * 100;
    const amountWithFee: number = (Number(e.target.value) * 997) / 1000;
    setToken((prev: Tokens) => ({
      ...prev,
      RBNT: e.target.value,
      // SHUBH: (ethers.utils.formatEther(ethers.utils.parseEther(e.target.value)) * 997) / 1000
      SHUBH: String((reserve1 * amountWithFee) / (reserve0 + amountWithFee)),
    }));
  };

  const swap = async (): Promise<void> => {
    // await addLiquidity(token.RBNT * 100);
    // await contract._approves1(ethers.utils.parseEther(token.RBNT));
    // await contract.RBNT.approve(contract, token.RBNT);
    // const sep_provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_TESTNET_RPC_URL);
    // console.log(contract);
    const amount: number = Number(token.RBNT) * 100;
    setLoading(true);
    try {
      const approval = await RBNTContract?.approve(contractAddress, amount);
      await approval?.wait();
      toast("Approved");
      const swapping = await contract?.exchange(amount);
      await swapping?.wait();
      toast("Swap Complete");
      const reserve0: number = Number(await contract?.reserveRBNT());
      const reserve1: number = Number(await contract?.reserveSHUBH());

      setReserve((prev: Reserves) => ({
        ...prev,
        reserve0: reserve0,
        reserve1: reserve1,
      }));
    } catch (error) {
      const error1 = error as Error;
      const errorMessage: string = error1.message.split("(")[0];
      toast(errorMessage);
    }
    setLoading(false);
    setToken((prev: Tokens) => ({ ...prev, RBNT: "", SHUBH: "" }));
  };

  return (
    <>
      {/* <Link href={{pathname: '/add-liquidity', query: {contract: contract}}}>Add liquidity</Link> */}

      <div className={styles.head}>
        <h2 className={styles.heading}>SHUBHSWAP</h2>
      </div>
      <Form
        token={token}
        onChange={handleRBNTChange}
        onClick={swap}
        val="Swap"
        loading={loading}
      />
      <ToastContainer position="top-left" />
    </>
  );
}
