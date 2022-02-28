import styled from "styled-components"
const FailedTransactionModal=styled.article`
  background-color:var(--negro-profundo);
  width:400px;
  height:auto;
  padding:12px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  color:var(--blanco-principal);
  z-index:9999;
  margin:2.5rem;  
  position:relative;
  border-radius:16px;
  border:1px solid rgba(195, 197, 203,0.6);
`
const FailedTransactionModalTop=styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  font-size:22px;
  font-weight:700;
`
const FailedTransactionModalMiddle=styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  flex-direction:column;
  color:var(--rojo);
  font-size:16px;
  padding:24px;
`
const FailedTransactionModalButton=styled.div`
  width:100%;
  padding:16px;
  background-color:var(--green-color);
  cursor:pointer;
  text-align:center;
  font-size:18px;
  border-radius:14px;
`

const AlertError = ({text,functionHandler}) => {
  return (
    <FailedTransactionModal>
    <FailedTransactionModalTop>
      <span>Error</span>
      <i className="fa-solid fa-xmark icono-cerrar" onClick={()=>functionHandler(false)}></i>
    </FailedTransactionModalTop>
    <FailedTransactionModalMiddle>
    <i className="fa-solid fa-triangle-exclamation icono-failedTransaction"></i>
      <span style={{textAlign:"center"}}>{text}</span>
    </FailedTransactionModalMiddle>
    <FailedTransactionModalButton onClick={()=>functionHandler(false)}>Salir</FailedTransactionModalButton>
  </FailedTransactionModal>
  )
}

export default AlertError