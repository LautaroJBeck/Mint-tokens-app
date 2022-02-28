import {useContext} from 'react'
import styled from "styled-components";
import NetworkContext from '../context/NetworkContext';
import backgroundColorHelper from "../helpers/backgroundColorHelper"
const Wrapper=styled.div`
    height:100vh;
    width:100vw;
    position:fixed;
    top:0;
    left:0;
    z-index:9;
    background:var(--${props=>props.color?props.color:"neutral"});

`
const BackgroundWrapper = () => {
    const {network}=useContext(NetworkContext);
  return (
    <Wrapper color={backgroundColorHelper(network)}/>
  )
}

export default BackgroundWrapper