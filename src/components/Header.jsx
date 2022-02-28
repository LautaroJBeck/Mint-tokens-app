import styled,{keyframes} from "styled-components";
import logo from "../imgs/Group.png";
import {useContext, useState,useEffect} from "react";
import SignerContext from "../context/SignerContext";
import ProviderContext from "../context/ProviderContext";
import {ethers} from "ethers";
import NetworkContext from "../context/NetworkContext";
import camelCase from "../helpers/camelCase";
import { useNavigate,useLocation} from "react-router-dom";



const size = {
    primerResize:"1080px",
    segundoResize:"875px",
    tercerResize:"450px",
    cuarto:"1350px"
  }
  

const StlyedHeader=styled.header`
width:100%;
height:5rem;
display:flex;
justify-content:space-between;
padding:var(--padding-mediano);
align-items:center;
z-index:16;
position:sticky;
top:0;
left:0;
`

//Header
const DivWrapper=styled.div`
width:33%;
height:100%;
display:flex;
justify-content:${props=>props.place};
align-items:center;
@media (max-width:1080px){
   display:none; 
}
`
//Para el header 1080px
const DivWrapper1080px=styled.div`

height:100%;
display:flex;
justify-content:space-evenly;
align-items:center;
@media (min-width:1080px){
   display:none; 
}
`
const ImgContainer=styled.div`
height:35px;
width:35px;
display:flex;
justify-content:center;
align-items:center;
@media (max-width:1080px){
    margin-right:var(--padding-chico);
}
`
const Img=styled.img`
width:100%;
height:100%;
object-fit:cover;
`
const ButtonContainer=styled.div`
height:45px;
width:400px;
display:flex;
justify-content:center;
align-items:center;
background-color:var(--negro-profundo);
border-radius:16px;
padding:2px;
z-index:10;
@media (max-width:875px){
    position:fixed;
    bottom:20px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
}
@media (max-width:450px){
    font-size:var(--font-size-chico);
    width:300px;
}
`
const ButtonHeader=styled.button`
width:50%;
height:100%;
display:flex;
justify-content:center;
align-items:center;
background-color:${props=>props.location?"var(--negro-secundario)":"var(--negro-profundo)"};
color:${props=>props.location?"var(--blanco-principal)":"var(--gris-secundario)"};
border:none;
border-radius:var(--border-radius-mediano);
transition:all 0.5s ease ;
cursor:pointer;
font-size:var(--font-size-mediano);
font-weight:bold;
&:hover{
    background-color:var(--negro-secundario);
    color:var(--blanco-principal);
}
@media (max-width:450px){
    font-size:var(--font-size-chico);
}
`
//Parte de la dirección y los fondos
const AccountHeader=styled.div`
width:auto;
height:40px;
background-color:var(--negro-profundo);
display:flex;
justify-content:center;
align-items:center;
border-radius:var(--border-radius-grande);
color:var(--blanco-principal);
font-weight:bold;
padding:2px;
position:relative;

`
const ConnectAccount=styled.button`
padding:var(--padding-chico);
width:100%;
height:100%;
border-radius:14px;
color:var(--blanco-principal);
color:#61b1eb;
background-color:#134e79;
font-weight:700;
font-size:var(--font-size-chico);
border:0;
cursor:pointer;
&:hover{
    outline:1px solid #61b1eb;
}

`
const FondosAccount=styled.div`
padding:var(--padding-chico);
@media (max-width:450px){
    display:none;
}
`
const AccountAddress=styled.div`
display:flex;
justify-content:center;
align-items:center;
height:100%;
background-color:var(--negro-secundario);
border-radius:var(--border-radius-mediano);
padding:var(--padding-chico);
user-select:none;
`
const WrongNetworkAccount=styled.div`
display:flex;
justify-content:center;
align-items:center;
height:100%;
background-color:var(--rojo);
color:var(--blanco-principal);
border-radius:var(--border-radius-mediano);
padding:var(--padding-chico);
user-select:none;
cursor:pointer;
transition:background-color 0.5s ease ;
&:hover{
background-color:rgb(204, 13, 13);
}
`
const IconWalletWrapper=styled.div`
margin-left:var(--padding-chico);
`
const NetworkPicker=styled.div`
width:auto;
height:40px;
background-color:var(--negro-profundo);
border:none;
border-radius:var(--border-radius-grande);
margin-right:var(--padding-chico);
display:flex;
padding:var(--padding-mediano);
color:var(--blanco-principal);
font-weight:700;
position:relative;
`
const NetworkPickerButton=styled.button`
border:0;
background-color:var(--negro-profundo);
display:flex;
align-items:center;
font-weight:700;
font-size:var(--font-size-chico);
color:var(--blanco);
cursor:pointer;
`
const NetworkCircle=styled.div`
width:16px;
height:16px;
background-color:var(--${props => props.network});
border-radius:100%;
margin-right:var(--padding-chico);
`
const NetworkTitle=styled.span`
color:var(--blanco-principal);
font-weight:700;
margin-right:var(--padding-chico);
@media (max-width:875px){
    display:${props=>props.title&&"none"};
}
`
const NetworkMainTitle=styled(NetworkTitle)`
margin-top:var(--padding-chico);
font-size:var(--font-size-mediano);
`
const NetworksModal=styled.div`
position:absolute;
top:60px;
left:0;
width:250px;
padding:var(--padding-mediano);
height:auto;
background-color:var(--negro-profundo);
font-weight:700;
border-radius:var(--border-radius-grande);
border:1px solid rgba(182,182,182,.3);
display:flex;
z-index:15;
flex-direction:column;
align-items:start;
@media (max-width:450px){
    left:-20px;
}

`
const NetworksModalItemWrappers=styled.div`
width:100%;
display:flex;
flex-direction:column;
align-items:center;
margin-top:var(--padding-chico);
`
const NetworksModalItem=styled.div`
display:flex;
width:100%;
padding:var(--padding-chico);
align-items:center;
font-weight:400;
cursor:pointer;
`

//WrongNetworkModal
const WrongNetworkLoaderAnimation=keyframes`
  0%{width:100%}
  100%{width:0%}
`
const WrongNetworkModalTop=styled.div`
    display:flex;
    width:100%;
    justify-content:space-evenly;
    align-items:center;

`
const CompletedTransactionLoader=styled.div`
    background-color:var(--blanco-principal);
    height:3px;
    width:100%;
    border-radius:5px;
    position:absolute;
    bottom:0px;
    left:0;
    animation-name:${WrongNetworkLoaderAnimation};
    animation-duration:15s;
    animation-timing-function:linear;
    animation-iteration-count:1;
    animation-fill-mode: forwards;
`
const WrongNetworkModal=styled.div`
    padding:var(--padding-mediano);
    width:385px;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-items:center;
    background-color:var(--negro-profundo);
    border-radius:var(--border-radius-chico);
    position:absolute;
    top:60px;
    left:-250px;
    text-align:start;
    @media (max-width:1350px){
    position:fixed;
    top:5rem;
    left:0px;
    right:0px;
    margin-left:auto;
    margin-right:auto;
    }
    @media (max-width:450px){
    width:300px;

    }
`
const WrongNetworkParraf=styled.p`
    font-size:var(--font-size-mas-chico);
    padding:var(--padding-chico);
    color:var(--blanco-principal);
    font-weight:400;
`






const posibleNetworksObject={
    "0x4":"rinkeby",
    "0x2a":"kovan",
    "0x3":"ropsten",
    "wrong":"elija alguna red de prueba"
}

const Header = () => {
    const {setSigner}=useContext(SignerContext);
    const {setProvider}=useContext(ProviderContext)
    const {network,setNetwork}=useContext(NetworkContext)

    const [account,setAccount]=useState("");
    const [founds,setFounds]=useState("");
    const [showModal,setShowModal]=useState(false);
    const [correctNetwork,setCorrectNetwork]=useState(true);
    const [installMetamask,setInstallMetamask]=useState(false);
    const navigate=useNavigate()
    const location=useLocation()
    const handleNetwork=async(newNetwork)=>{
        if(newNetwork==="0x4"||newNetwork==="0x2a"||newNetwork==="0x3"){
            let nameNetwork=newNetwork;
            
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: nameNetwork }],
                });
                setNetwork(newNetwork)
                setCorrectNetwork(true);
            }catch(switchError) {
    
            }
        }else{
            setCorrectNetwork(false);
            setNetwork("wrong")
            
        }
        setShowModal(false);
    }
    const handleConnection=async()=>{
        if(window.ethereum){
            //Conectar el proveedor (Metamask)
            const proveedor=new ethers.providers.Web3Provider(window.ethereum);
            setProvider(proveedor);
            await proveedor.send("eth_requestAccounts",[]);

            //Conectar el firmante (signer)
            const firmante=proveedor.getSigner();
            setSigner(firmante)
            let signerAddress=await firmante.getAddress();

            //Ver el balance y la dirección
            let balance=await firmante.getBalance();
            let balanceEthers=parseFloat(ethers.utils.formatEther(balance)).toFixed(2);
            setAccount(signerAddress);
            setFounds(balanceEthers);
            let red=await window.ethereum.request({ method: 'eth_chainId' });
            handleNetwork(red)
        }else{
            if(!installMetamask){
                setInstallMetamask(true);
                setTimeout(()=>{
                    setInstallMetamask(false);
                },15000)
            }
        }
    }
    const handleLocation=(location)=>{
        navigate(location);
    }
    useEffect(()=>{
        if(window.ethereum){
            window.ethereum.on("accountsChanged",(accounts)=>{
                handleConnection()
            })
            window.ethereum.on("connect",()=>{
                handleConnection()
            })
            window.ethereum.on("chainChanged",(chainId)=>{
                handleConnection()
            })
        }else{
        }
    },[])



  return (
        <StlyedHeader>

                {/* Header 1080px empieza*/}
                <DivWrapper1080px>
                    <ImgContainer>
                        <Img src={logo} alt="Logo proyecto"></Img>
                    </ImgContainer>
                    <ButtonContainer>
                        <ButtonHeader location={location.pathname==="/mint-token"?true:false} onClick={()=>handleLocation("/mint-token")}>Crear token</ButtonHeader>
                        <ButtonHeader location={location.pathname==="/see-tokens"?true:false} onClick={()=>handleLocation("/see-tokens")}>Ver mis tokens</ButtonHeader>
                    </ButtonContainer>
                </DivWrapper1080px>
                <DivWrapper1080px>
                {network&&(<NetworkPicker>
                    <NetworkPickerButton onClick={()=>setShowModal(!showModal)}>
                        {network!=="wrong"&&<NetworkCircle network={posibleNetworksObject[network]}/>}
                        <NetworkTitle title>{camelCase(posibleNetworksObject[network])}</NetworkTitle>
                        {showModal?<i className="fa-solid fa-xmark icono-account"></i>:<i className="fa-solid fa-angle-down icono-account"></i>}
                    </NetworkPickerButton>
                    {showModal && <NetworksModal>
                        <NetworkMainTitle>Seleccione alguna red</NetworkMainTitle>
                        <NetworksModalItemWrappers>
                            <NetworksModalItem onClick={()=>handleNetwork("0x4")}>
                                    <NetworkCircle network="rinkeby"/>
                                    <NetworkTitle>Rinkeby</NetworkTitle>
                                    <div></div>
                            </NetworksModalItem>
                            <NetworksModalItem onClick={()=>handleNetwork("0x2a")}>
                                    <NetworkCircle network="kovan"/>
                                    <NetworkTitle>Kovan</NetworkTitle>
                                    <div></div>
                            </NetworksModalItem>
                            <NetworksModalItem onClick={()=>handleNetwork("0x3")}>
                                    <NetworkCircle network="ropsten"/>
                                    <NetworkTitle>Ropsten</NetworkTitle>
                                    <div></div>
                            </NetworksModalItem>
                        </NetworksModalItemWrappers>
                    </NetworksModal>}
                </NetworkPicker>)}
                <AccountHeader>
                    <>
                    {installMetamask&&<WrongNetworkModal>
                                <WrongNetworkModalTop>
                                    <i className="fa-solid fa-triangle-exclamation icono-noMetamask"></i> 
                                    <WrongNetworkParraf>No fue posible instalar una conexión con Metamask. Para usar la aplicación, debe instalar Metamask como extensión dentro de su navegador.</WrongNetworkParraf>
                                    <i 
                                    className="fa-solid fa-xmark icono-closeNoMetamask"
                                    onClick={()=>setInstallMetamask(false)}
                                    ></i>
                                </WrongNetworkModalTop>
                                <CompletedTransactionLoader></CompletedTransactionLoader>
                            </WrongNetworkModal>}
                   {correctNetwork?((account&&founds)?
                    (
                        <>
                            <FondosAccount>{founds} ETH</FondosAccount>
                            <AccountAddress>
                                <span>
                                 {account.slice(0,5)}...{account.slice(-4)}  
                                </span>
                                <IconWalletWrapper>
                                    <i className="fa-solid fa-wallet icono"></i>
                                </IconWalletWrapper>
                            </AccountAddress>
                        </>
                    
                    )
                    :
                    (
                        <>
                            <ConnectAccount onClick={()=>handleConnection()}>
                                Conectar cuenta
                            </ConnectAccount>
                        </>
                    )
                   ):<WrongNetworkAccount>
                       <i className="fa-solid fa-globe icono-wrong-network"></i>
                       <span className="icono-wrong-network">Red incorrecta</span>
                       </WrongNetworkAccount>}
                    </>
                </AccountHeader>
                </DivWrapper1080px>
                {/* Header 1080px termina*/}

                <DivWrapper place="left">
                    <ImgContainer>
                        <Img src={logo} alt="Logo proyecto"></Img>
                    </ImgContainer>
                </DivWrapper>
                <DivWrapper place="center">
                    <ButtonContainer>
                        <ButtonHeader onClick={()=>handleLocation("/mint-token")}>Crear token</ButtonHeader>
                        <ButtonHeader onClick={()=>handleLocation("/see-tokens")}>Ver mis tokens</ButtonHeader>
                    </ButtonContainer>
                </DivWrapper>
                <DivWrapper place="right">
            {network&&(<NetworkPicker>
                    <NetworkPickerButton onClick={()=>setShowModal(!showModal)}>
                        {network!=="wrong"&&<NetworkCircle network={posibleNetworksObject[network]}/>}
                        <NetworkTitle>{camelCase(posibleNetworksObject[network])}</NetworkTitle>
                        {showModal?<i className="fa-solid fa-xmark icono-account"></i>:<i className="fa-solid fa-angle-down icono-account"></i>}
                    </NetworkPickerButton>
                    {showModal && <NetworksModal>
                        <NetworkMainTitle>Seleccione alguna red</NetworkMainTitle>
                        <NetworksModalItemWrappers>
                            <NetworksModalItem onClick={()=>handleNetwork("0x4")}>
                                    <NetworkCircle network="rinkeby"/>
                                    <NetworkTitle>Rinkeby</NetworkTitle>
                                    <div></div>
                            </NetworksModalItem>
                            <NetworksModalItem onClick={()=>handleNetwork("0x2a")}>
                                    <NetworkCircle network="kovan"/>
                                    <NetworkTitle>Kovan</NetworkTitle>
                                    <div></div>
                            </NetworksModalItem>
                            <NetworksModalItem onClick={()=>handleNetwork("0x3")}>
                                    <NetworkCircle network="ropsten"/>
                                    <NetworkTitle>Ropsten</NetworkTitle>
                                    <div></div>
                            </NetworksModalItem>
                        </NetworksModalItemWrappers>
                    </NetworksModal>}
                </NetworkPicker>)}
                <AccountHeader>
                    <>
                    {installMetamask&&<WrongNetworkModal>
                                <WrongNetworkModalTop>
                                    <i className="fa-solid fa-triangle-exclamation icono-noMetamask"></i> 
                                    <WrongNetworkParraf>No fue posible instalar una conexión con Metamask. Para usar la aplicación, debe instalar Metamask como extensión dentro de su navegador.</WrongNetworkParraf>
                                    <i 
                                    className="fa-solid fa-xmark icono-closeNoMetamask"
                                    onClick={()=>setInstallMetamask(false)}
                                    ></i>
                                </WrongNetworkModalTop>
                                <CompletedTransactionLoader></CompletedTransactionLoader>
                            </WrongNetworkModal>}
                   {correctNetwork?((account&&founds)?
                    (
                        <>
                            <FondosAccount>{founds} ETH</FondosAccount>
                            <AccountAddress>
                                <span>
                                 {account.slice(0,5)}...{account.slice(-4)}  
                                </span>
                                <IconWalletWrapper>
                                    <i className="fa-solid fa-wallet icono"></i>
                                </IconWalletWrapper>
                            </AccountAddress>
                        </>
                    
                    )
                    :
                    (
                        <>
                            <ConnectAccount onClick={()=>handleConnection()}>
                                Conectar cuenta
                            </ConnectAccount>
                        </>
                    )
                   ):<WrongNetworkAccount>
                       <i className="fa-solid fa-globe icono-wrong-network"></i>
                       <span className="icono-wrong-network">Red incorrecta</span>
                       </WrongNetworkAccount>}
                    </>
                </AccountHeader>
                    
            </DivWrapper>
        </StlyedHeader>

  )
}

export default Header