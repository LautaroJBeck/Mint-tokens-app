import {createContext,useState} from "react";
const SignerContext=createContext();

const SignerProvider=({children})=>{
    const [signer,setSigner]=useState("");
    const data={signer,setSigner};
    return <SignerContext.Provider value={data}>{children}</SignerContext.Provider>

}
export {SignerProvider}
export default SignerContext