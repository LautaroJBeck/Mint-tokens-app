
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import ethPng from "../imgs/ethpng.png"
import {ethers} from "ethers";
import { ERC20abi } from "../helpers/contractsInfo";
import ProviderContext from "../context/ProviderContext";
import SignerContext from "../context/SignerContext";
const TokenListElement=styled.div`
    width:350px;
    height:auto;
    background:var(--negro-secundario);
    border-radius:16px;
    padding:12px;
    margin:20px;
    display:flex;   
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    @media (max-width:875px){
        width:300px;
        margin:10px;
        padding:6px;
    }
    @media (max-width:475px){
        width:250px;
        padding:var(--padding-chico);
    }
`
const TokenListElementTop=styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    margin:12px;
`
const TokenListElementIcon=styled.div`
    height:100%;
    width:100px;
    border-radius:14px;
    background-color:var(--negro-profundo);
    display:flex;
    padding:6px;
    justify-content:space-around;
    align-items:center;
    color:var(--blanco-principal);
    font-weight:700;

`
const EthereumImage=styled.img`
    max-width:25px;
`
const TokenListElementButton=styled.div`
    padding:12px;
    background-color:var(--green-color);
    color:var(--blanco-principal);
    border-radius:12px;
    cursor:pointer;
    @media (max-width:475px){
        padding:0px;
        text-align:center;
        margin:6px;
    }
`
const TokenListElementBottom=styled.div`
    display:flex;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    margin:12px;
    @media (max-width:475px){
        display:none;
    }
`
const AddressSpan=styled.span`
    font-size:12px;
    color:var(--blanco-principal);
    font-weight:700;
    @media (max-width:875px){
        font-size:10px;
    }

`
const ContractElement = ({address}) => {
    const [symbol,setSymbol]=useState("")
    const {provider}=useContext(ProviderContext)
    const {signer}=useContext(SignerContext)
    const callFunction=async()=>{
        const tokenFactoryContract=new ethers.Contract(address,ERC20abi,provider);
        const signedContract=tokenFactoryContract.connect(signer);
        const simbolo=await signedContract.symbol();

        setSymbol(simbolo)
    }
    const addToMetamask=async(contractAddress,simbolo)=>{
        try{
            await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', 
              options: {
                address: contractAddress,
                symbol: simbolo,
                decimals: 18, 
                image: ethPng, 
              },
            },
          });
        }catch(err){
        }
    }
    useEffect(()=>{
        callFunction()
    },[])
  return (
            <TokenListElement>
                    <TokenListElementTop>
                    <TokenListElementIcon>
                        <EthereumImage src={ethPng} alt="ethereumImage" />
                        <span>{symbol}</span>
                    </TokenListElementIcon>
                    <TokenListElementButton onClick={()=>addToMetamask(address,symbol)}>Agregar a metamask</TokenListElementButton>
                </TokenListElementTop>
                <TokenListElementBottom>
                    <AddressSpan>{address}</AddressSpan>
                </TokenListElementBottom>
            </TokenListElement>
  )
}

export default ContractElement