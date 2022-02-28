import {createContext,useState} from "react";


const NetworkContext=createContext();
const NetworkProvider=({children})=>{
    const [network,setNetwork]=useState("");
    
    const data={network,setNetwork}

    return <NetworkContext.Provider value={data}>{children}</NetworkContext.Provider>
}
export {NetworkProvider};
export default NetworkContext