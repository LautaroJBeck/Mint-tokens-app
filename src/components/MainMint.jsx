import { ethers } from "ethers";
import {useState,useContext} from "react";
import styled,{keyframes} from "styled-components";
import NetworkContext from "../context/NetworkContext";
import ProviderContext from "../context/ProviderContext";
import SignerContext from "../context/SignerContext";
import {contractsLists,contractAbi} from "../helpers/contractsInfo"
import loading_tx from "../imgs/loading_tx.svg"; 
import AlertError from "./AlertError";
import { useNavigate} from "react-router-dom";


const StyledMainWrapper=styled.main`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  width:100%;
  margin-top:var(--margin-grande);

  @media (max-width:475px){
    margin-top:2rem;


    }
`
const AddingTokenForm=styled.section`
  width:var(--width-500px);
  height:auto;
  background-color:var(--negro-profundo);
  display:flex;
  flex-direction:column;
  padding:var(--padding-mediano);
  z-index:9;
  border-radius:32px;
  position:relative;
  @media (max-width:550px){
    width:450px;
  }
  @media (max-width:475px){
    width:400px;
  }
  @media (max-width:415px){
    width:320px;
  }
`
const TokenFormTitle=styled.h4`
  padding:0px .5rem;
  margin-bottom:var(--padding-chico);
  font-size:var(--font-size-grande);
  color:var(--blanco-principal);
  @media (max-width:550px){
    font-size:var(--font-size-mediano);
  }
`
const InputTokenForm=styled.input`
  border:0;
  outline:0;
  font-size:var(--font-size-grande);
  background-color:var(--negro-secundario);
  color:var(--blanco-principal);
  border-radius:var(--border-radius-grande);
  padding:var(--padding-grande);
  width:100%;
  margin-top:var(--padding-mediano);
  &::placeholder{
  color:var(--gris);
  }
  @media (max-width:550px){
    font-size:var(--font-size-mediano);
    padding:var(--padding-mediano);
  }
  @media (max-width:475px){
    font-size:var(--font-size-chico);
  }
  @media (max-width:415px){
    margin-top:var(--padding-chico);
  }
`
const SendButtonTokenForm=styled.button`
  border:0;
  outline:0;
  font-size:var(--font-size-grande);
  border-radius:var(--border-radius-grande);
  padding:var(--padding-mediano);
  width:100%;
  background-color:var(--${props=>props.color});
  color:var(--${props=>props.fuente});
  margin-top:var(--padding-mediano);
  cursor:${props=>props.cursor};
  transition:.5s ease;  
  @media (max-width:550px){
    font-size:var(--font-size-mediano);
    padding:var(--padding-mediano);
  }
  @media (max-width:475px){
    font-size:var(--font-size-chico);
  }
`
//Modal de la parte de las networks
const WrongNetworkModalWrapper=styled.div`
  position:absolute;
  top:0;
  left:0;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  width:100vw;
  background-color:rgba(0,0,0,0.6);
  z-index:99;
`
const WrongNetworkModal=styled.div`
  background-color:var(--negro-profundo);
  width:var(--width-450px);
  border-radius:16px;
  border:1px solid rgba(182,182,182,0.4);
  height:auto;
  padding:var(--padding-grande);
  display:flex;
  flex-direction:column;
  color:var(--blanco-principal);
  z-index:99;
`
const WrongNetworkModalTopSection=styled.section`
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:100%;
  font-weight:700;
  font-size:var(--font-size-grande);
  padding:var(--padding-chico);
  margin-bottom:10px;
  `
const WrongNetworkModalBottomSection=styled.section`
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:100%;
  padding:var(--padding-chico);
`
const WaitingForTransactionModal=styled.section`
  background-color:var(--negro-profundo);
  width:var(--width-350px);
  height:auto;
  border-radius:var(--border-radius-grande);
  border:1px solid rgba(182,182,182,0.4);
  height:auto;
  padding:var(--padding-mediano);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  color:var(--blanco-principal);
  z-index:14;
  margin:var(--margin-grande);
  @media (max-width:415px){
    width:300px;
    margin:2rem;

  }
`
const WaitingForTransactionModalTitles=styled.span`
  font-size:var(--font-size-mediano);
  text-align:center;
  padding:8px 0px;
`
const CompletedTransactionModal=styled.section`
  background-color:var(--negro-profundo);
  width:var(--width-350px);
  height:auto;
  padding:var(--padding-mediano);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  color:var(--blanco-principal);
  z-index:14;
  margin:var(--margin-grande);  
  position:relative;
  border-radius:var(--border-radius-chico);
  @media (max-width:415px){
    width:300px;
    margin:2rem;
  }

`
const CompletedTransactionModalTitle=styled.span`
  font-size:var(--font-size-mediano);
  text-align:center;
  padding:8px 0px;
`
const CompletedTransactionModalTitleSecondary=styled.p`
  font-size:var(--font-size-chico);
  padding:8px 0px;

  text-align:center;
` 
const CompletedTransactionModalButton=styled.button`
  cursor:pointer;
  color:var(--blanco-principal);
  background-color:var(--green-color);
  font-size:var(--font-size-chico);
  margin:8px 0px;
  padding:8px;
  border:0;
  border-radius:var(--border-radius-chico);
`
const KeyframeLoaderDiv=keyframes`
  0%{width:100%}
  100%{width:0%}
`
const CompletedTransactionLoader=styled.div`
  background-color:var(--blanco-principal);
  height:3px;
  width:100%;
  border-radius:2px;
  position:absolute;
  bottom:0px;
  left:0;
  animation-name:${KeyframeLoaderDiv};
  animation-duration:8s;
  animation-timing-function:linear;
  animation-iteration-count:1;
  animation-fill-mode: forwards;
`







const initialForm={
  tokenName:"",
  tokenSymbol:"",
  tokenSupply:""
}
const MainMint = () => {
  //Context variables
  const {network}=useContext(NetworkContext);
  const {provider}=useContext(ProviderContext);
  const {signer}=useContext(SignerContext);
  //State Variables
  const [stateForm,setStateForm]=useState(initialForm)
  const [showWrongNetworkModal,setShowWrongNetworkModal]=useState(false)
  const [waitingForTransaction,setWaitingForTransaction]=useState(false);
  const [transactionCompleted,setTransactionCompleted]=useState(false);
  const [failedTransaction,setFailedTransaction]=useState(false);
  const [writingError,setWritingError]=useState(false);
  const [writingErrorSymbol,setWritingErrorSymbol]=useState(false)
  const [returnNoMetamask,setReturnNoMetamask]=useState(false);
  //Functions

  const navigate=useNavigate()
  const handleStateForm=(e)=>{
    setStateForm({
      ...stateForm,
      [e.target.name]:e.target.value
    })
  }
  const createToken=async()=>{
    if(stateForm.tokenName&&stateForm.tokenSymbol&&stateForm.tokenSupply){
      try{
        if(!window.ethereum){
          setReturnNoMetamask(true);
          return;
        }
        const tokenFactoryContract=new ethers.Contract(contractsLists[network],contractAbi,provider);
        const signedContract=tokenFactoryContract.connect(signer);
        if(!parseInt(stateForm.tokenSupply)){
          setWritingError(true);
          return;
        }
        if(stateForm.tokenSymbol.length>5){
          setWritingErrorSymbol(true)
          return;
        }
        const creacionToken=await signedContract.createNewToken(stateForm.tokenSupply,stateForm.tokenName,stateForm.tokenSymbol);
        setWaitingForTransaction(true);
        await creacionToken.wait();
        setWaitingForTransaction(false);
        setTransactionCompleted(true);
        setTimeout(()=>{
          setTransactionCompleted(false);
        },8000)
      }catch(err){
        setFailedTransaction(true);
      }
      setStateForm(initialForm);
    }

  }
  const openWrongNetworkModal=()=>{
    setShowWrongNetworkModal(true);
  }
  const closeWrongNetworkModal=()=>{
    setShowWrongNetworkModal(false);
  }
  return (
    <StyledMainWrapper>
      <AddingTokenForm>
        <TokenFormTitle>Crear Token</TokenFormTitle>
        <InputTokenForm 
        placeholder="Nombre del token. Ej: Uniswap"
        name="tokenName"
        value={stateForm.tokenName}
        onChange={(e)=>handleStateForm(e)}
        />
        
        <InputTokenForm 
        placeholder="Símbolo del token. Ej: UNI"
        name="tokenSymbol"
        value={stateForm.tokenSymbol}
        onChange={(e)=>handleStateForm(e)}

        />

        <InputTokenForm 
        placeholder="Suministro total del token. Ej: 1.000.000.000"
        name="tokenSupply"
        value={stateForm.tokenSupply}
        onChange={(e)=>handleStateForm(e)}
        />

       {network!=="wrong"?<SendButtonTokenForm 
        color={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)?"green-color":"negro-secundario"}
        fuente={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)?"blanco-principal":"gris-secundario"}
        cursor={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)?"pointer":"auto"}
        onClick={()=>createToken()}
        >
          Emitir Token
        </SendButtonTokenForm>
        :
        (
        <SendButtonTokenForm
        color={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)?"green-color":"negro-secundario"}
        fuente={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)?"blanco-principal":"gris-secundario"}
        cursor={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)?"pointer":"auto"}
        onClick={(stateForm.tokenName&&stateForm.tokenSupply&&stateForm.tokenSymbol)&&(()=>openWrongNetworkModal())}
        >Emitir Token</SendButtonTokenForm>
        )}
      </AddingTokenForm>
      {showWrongNetworkModal&&(
        <WrongNetworkModalWrapper >
          <WrongNetworkModal >
            <WrongNetworkModalTopSection>
              <span>Red incorrecta</span>
              <i className="fa-solid fa-xmark icono-cerrar" onClick={()=>closeWrongNetworkModal()}  ></i>
            </WrongNetworkModalTopSection>
            <WrongNetworkModalBottomSection>
              <span>Conéctate a una red que sea compatible en el menú despegable o desde su billetera</span>
            </WrongNetworkModalBottomSection>
          </WrongNetworkModal>
        </WrongNetworkModalWrapper>
      )
      }
    {waitingForTransaction&&<WaitingForTransactionModal>
        <WaitingForTransactionModalTitles>Esperando la confirmación de transacción</WaitingForTransactionModalTitles>
        <img src={loading_tx} alt="loading" />
        <WaitingForTransactionModalTitles>Emitiendo {stateForm.tokenSymbol} tokens</WaitingForTransactionModalTitles>
    </WaitingForTransactionModal>}

    {transactionCompleted&&<CompletedTransactionModal>
      <CompletedTransactionModalTitle>Token creado</CompletedTransactionModalTitle>
      <CompletedTransactionModalTitleSecondary>El contrato del token ha sido procesado y agregado a la red de prueba</CompletedTransactionModalTitleSecondary>
      <CompletedTransactionModalButton onClick={()=>navigate("/see-tokens")}>Ver tus tokens</CompletedTransactionModalButton>
      <CompletedTransactionLoader/>
    </CompletedTransactionModal>}


      {failedTransaction&&<WrongNetworkModalWrapper>
      <AlertError text="Ocurrió un error, transacción rechazada" functionHandler={setFailedTransaction}/>
      </WrongNetworkModalWrapper>}
      {writingError&&<WrongNetworkModalWrapper>
        <AlertError text="La cantidad de suplemento total del token no es correcta" functionHandler={setWritingError}/>
      </WrongNetworkModalWrapper>}
      {writingErrorSymbol&&<WrongNetworkModalWrapper>
        <AlertError text="El símbolo del token no puede tener más de 5 caractéres" functionHandler={setWritingErrorSymbol}/>
      </WrongNetworkModalWrapper>}
        {returnNoMetamask&&<WrongNetworkModalWrapper>
        <AlertError text="No tienes una cuenta de Metamask conectada" functionHandler={setReturnNoMetamask}/>
      </WrongNetworkModalWrapper>}
    </StyledMainWrapper>
  )
}
export {StyledMainWrapper}
export default MainMint