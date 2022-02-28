import styled from "styled-components"
import { StyledMainWrapper } from "./MainMint"
import { useEffect,useState,useContext } from "react"
import {ethers} from "ethers"
import SignerContext from "../context/SignerContext"
import { contractAbi,contractsLists} from "../helpers/contractsInfo"
import NetworkContext from "../context/NetworkContext"
import ProviderContext from "../context/ProviderContext"
import ContractElement from "./ContractElement"
import loading_tx from "../imgs/loading_tx.svg"; 
import { useNavigate} from "react-router-dom";
const TokenListsContainer=styled.article`
    display:flex;
    width:var(--width-850px);
    height:auto;
    flex-direction:column;
    justify-content:space-evenly;
    align-items:center;
    padding:var(--padding-mediano);
    border-radius:var(--border-radius-grande);
    position:relative;
    z-index:11;
    background-color:var(--negro-profundo);
    @media (max-width:875px){
        width:450px;
        padding:var(--padding-chico);   
    }
    @media (max-width:475px){
        width:300px;
        padding:var(--padding-chico);
    }
`
const ContractListTitle=styled.h4`
    font-size:var(--font-size-grande);
    color:var(--blanco-principal);
    padding:var(--padding-mediano);
    text-align:center;
`
const ContractListsContainer=styled.nav`
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    align-items:center;
    width:100%;
`
const NoMetamaskContainer=styled.article`
    display:flex;
    width:var(--width-450px);
    height:auto;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    padding:var(--padding-mediano);
    border-radius:var(--border-radius-grande);
    z-index:11;
    background-color:var(--negro-profundo);
    @media (max-width:475px){
        width:300px;
    }

`
const NoMetamaskTitle=styled.h4`
    font-size:var(--font-size-grande);
    color:var(--blanco-principal);
    padding:var(--padding-mediano);
    text-align:center;
    @media (max-width:475px){
        font-size:var(--font-size-mediano);
    }
`
const NoMetamaskParraf=styled.p`
    font-size:var(--font-size-mediano);
    font-weight:400;
    color:var(--blanco-principal);
    padding:var(--padding-mediano);
    text-align:center;
    @media (max-width:475px){
        font-size:var(--padding-mediano);
    }
`
const LoadingContractsContainer=styled.article`
    display:flex;
    width:var(--width-500px);
    height:auto;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    padding:var(--padding-mediano);
    border-radius:var(--border-radius-grande);
    z-index:11;
    background-color:var(--negro-profundo);
    @media (max-width:475px){
        width:300px;
    }
`
const LoadingContractTitle=styled.h4`
    font-size:var(--font-size-grande);
    color:var(--blanco-principal);
    padding:var(--padding-grande);
    text-align:center;
`
const NoTokensContainer=styled.article`
    display:flex;
    width:var(--width-450px);
    height:auto;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    padding:var(--padding-mediano);
    border-radius:var(--border-radius-grande);
    z-index:11;
    background-color:var(--negro-profundo);
    @media (max-width:475px){
    width:300px;
  }
`
const FailedTransactionModalButton=styled.div`
  width:auto;
  padding:var(--padding-mediano);
  background-color:var(--green-color);
  cursor:pointer;
  text-align:center;
  color:var(--blanco-principal);
  font-size:var(--font-size-mediano);
  border-radius:var(--border-radius-mediano);
  margin:var(--padding-mediano);
`
const MainSee = () => {
    const {signer}=useContext(SignerContext)
    const {network}=useContext(NetworkContext);
    const {provider}=useContext(ProviderContext)
    
    const [contractsDeployed,setContractsDeployed]=useState([])
    const [loadingContracts,setLoadingContracts]=useState(false);

    const navigate=useNavigate()
    const contractFunction=async()=>{
        if(signer&&network){
            try{
                setLoadingContracts(true)
                let firmante=await signer.getAddress();
                const tokenFactoryContract=new ethers.Contract(contractsLists[network],contractAbi,provider);
                const signedContract=tokenFactoryContract.connect(signer);
                const resultado=await signedContract.ownerToDeployedContracts(firmante);
                let pseudoArray=[];
                for(let i=0;i<resultado.toNumber();i++){
                    let contratoEmitido=await signedContract.ownerToTokens(firmante,i);
                    pseudoArray.push(contratoEmitido);
                }
                setContractsDeployed(pseudoArray)
                
            }catch(err){
                setContractsDeployed([])
            }
            setLoadingContracts(false)
        }
    }
    useEffect(()=>{
        if(window.ethereum){
            contractFunction()
            window.ethereum.on("accountsChanged",(accounts)=>{
                contractFunction()
            })
            window.ethereum.on("connect",()=>{
                contractFunction()
            })
            window.ethereum.on("chainChanged",(chainId)=>{
                contractFunction()
            })
        }
    },[signer,network])
  return (
    <StyledMainWrapper>
        {(network&&signer)?(


            <>
            {loadingContracts?(
            <LoadingContractsContainer>
                <LoadingContractTitle>Cargando la lista de tokens creados</LoadingContractTitle>
                <img src={loading_tx} alt="loading" />
            </LoadingContractsContainer>
            ):(
                <>
                {contractsDeployed.length>0?(

                    <TokenListsContainer>
                    <ContractListTitle>Lista de tokens emitidos:</ContractListTitle>
                    <ContractListsContainer>
                        {contractsDeployed.map(el=><ContractElement address={el}/>)}
                    </ContractListsContainer>
                    </TokenListsContainer>

                ):(
                    <NoTokensContainer>
                        <ContractListTitle>Aún no has emitido ningún token en esta red</ContractListTitle>
                        <FailedTransactionModalButton onClick={()=>navigate("/mint-tokens")}>Prueba emitir alguno</FailedTransactionModalButton>
                    </NoTokensContainer>
                )}
                </>
            )
            }
            </>
        
        
        )
        :(<NoMetamaskContainer>
            <NoMetamaskTitle>Conexión a Metamask no detectada</NoMetamaskTitle>
                <i className="fa-solid fa-triangle-exclamation icono-failedTransaction"></i>
            <NoMetamaskParraf>Conectate a Metamask para poder ver los tokens que has emitido usando esta aplicación</NoMetamaskParraf>
        </NoMetamaskContainer>)
        }
    </StyledMainWrapper>
  )
}

export default MainSee