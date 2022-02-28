import {createContext,useState} from "react";


const ProviderContext=createContext();
const ProviderProvider=({children})=>{
    const [provider,setProvider]=useState({});
    
    const data={provider,setProvider}

    return <ProviderContext.Provider value={data}>{children}</ProviderContext.Provider>
}
export {ProviderProvider};
export default ProviderContext