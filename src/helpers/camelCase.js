const camelCase=(string)=>{
    let primeraLetra=string[0].toUpperCase();
    let stringSinPrimeraLetra=string.slice(1);
    return `${primeraLetra}${stringSinPrimeraLetra}`
}
export default camelCase