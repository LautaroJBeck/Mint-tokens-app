import BackgroundWrapper from "./components/BackgroundWrapper";
import Header from "./components/Header";
import MainMint from "./components/MainMint";
import { NetworkProvider } from "./context/NetworkContext";
import { ProviderProvider } from "./context/ProviderContext";
import { SignerProvider } from "./context/SignerContext";
import {BrowserRouter,Route,Routes,Navigate} from "react-router-dom";
import MainSee from "./components/MainSee";

function App() {
  return (
  <>
  <SignerProvider>
    <ProviderProvider>
      <NetworkProvider>
        <BrowserRouter>
          <Header/>
          <BackgroundWrapper/>
          <Routes>
            <Route path="/" element={<Navigate to="/mint-token"/>}/>
            <Route path="mint-token" element={<MainMint/>}/>
            <Route path="see-tokens" element={<MainSee/>}/>
            <Route path="*" element={<Navigate to="/mint-token"/>}/>

          </Routes>
        </BrowserRouter>
      </NetworkProvider>
    </ProviderProvider>
  </SignerProvider>
  </>
  );
}

export default App;
