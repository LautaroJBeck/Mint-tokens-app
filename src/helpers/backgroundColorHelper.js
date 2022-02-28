const referencias={
    "0x4":"rinkeby-fondo",
    "0x2a":"kovan-fondo",
    "0x3":"ropsten-fondo",
    "wrong":"wrong-fondo"
}
const backgroundColorHelper=(red)=>{
    return referencias[red]
}
export default backgroundColorHelper;