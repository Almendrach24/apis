const selectOrigen = document.querySelector("#indicadorOrigen")
const selectAevaluar = document.querySelector("#indicadorAevaluar");
const input = document.querySelector("#cantidadAconvertir");
const resultado = document.querySelector("#resultado");
const buscar = document.querySelector("#convertir");
const error = document.querySelector("#error");
const error1 = document.querySelector("#error1");
const chartDOM = document.querySelector("#myChart");
let myChart;

buscar.addEventListener("click", ()=>{
    getMindicador(input.value, selectOrigen.value, selectAevaluar.value);
})

async function getMindicador (input1, selectorigen, selectaevaluar){
    try{
        const data = await fetch("https://mindicador.cl/api");
        const dataEnjs = await data.json();
        definirOperadoresYresultado(dataEnjs, input1, selectorigen, selectaevaluar);

    }
    catch (e){
        error.innerHTML = `!Algo salió mal¡ Error: ${e.message}`;
    }
}

function definirOperadoresYresultado (dataEnjs, input1, selectorigen, selectaevaluar){
    let resultado1 = 0;

    if(selectorigen === "clp" && (selectaevaluar === "dolar" || selectaevaluar === "euro" || selectaevaluar === "bitcoin"|| selectaevaluar === "uf"|| selectaevaluar === "libra_cobre")){

        if(selectaevaluar === "dolar" || selectaevaluar === "euro" || selectaevaluar === "uf" ){
            resultado1 = (parseInt(input1) / (parseInt(dataEnjs[selectaevaluar].valor))).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else{
            resultado1 = ((parseInt(input1) / (parseInt(dataEnjs.dolar.valor))) / (dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        renderizarGrafica(dataEnjs, input1, selectorigen, selectaevaluar);
    }


    if(selectorigen === "dolar" && (selectaevaluar === "dolar" || selectaevaluar === "euro" || selectaevaluar === "bitcoin"|| selectaevaluar === "uf"|| selectaevaluar === "libra_cobre")){



        if(selectaevaluar === "euro" || selectaevaluar === "uf" ){
            resultado1 = ((parseInt(input1) * (parseInt(dataEnjs.dolar.valor))) / (dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else if (selectaevaluar === "bitcoin" || selectaevaluar === "libra_cobre"){
            resultado1 = ((parseInt(input1) / (dataEnjs[selectaevaluar].valor)).toFixed(6));
            resultado.innerHTML = resultado1;
        }
        else
            resultado.innerHTML = input1;

        renderizarGrafica(dataEnjs, input1, selectorigen, selectaevaluar);
    }

    if(selectorigen === "euro" && (selectaevaluar === "dolar" || selectaevaluar === "euro" || selectaevaluar === "bitcoin"|| selectaevaluar === "uf"|| selectaevaluar === "libra_cobre")){


        if(selectaevaluar === "dolar" || selectaevaluar === "uf" ){
            resultado1 = ((parseInt(input1) * (parseInt(dataEnjs.euro.valor))) / (dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else if (selectaevaluar === "bitcoin" || selectaevaluar === "libra_cobre"){
            resultado1 = ((parseInt(input1) * (dataEnjs.euro.valor)) / (dataEnjs.dolar.valor) / (dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else
            resultado.innerHTML = input1;

        renderizarGrafica(dataEnjs, input1, selectorigen, selectaevaluar);
    }

    if(selectorigen === "bitcoin" && (selectaevaluar === "dolar" || selectaevaluar === "euro" || selectaevaluar === "bitcoin"|| selectaevaluar === "uf"|| selectaevaluar === "libra_cobre")){

        if(selectaevaluar === "euro" || selectaevaluar === "uf" ){
            resultado1 = (((input1)*(dataEnjs.dolar.valor)*(dataEnjs[selectorigen].valor))/(dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else if (selectaevaluar === "dolar"){
            resultado1 = ((parseInt(input1) * (dataEnjs[selectorigen].valor))).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else if (selectaevaluar === "libra_cobre"){
            resultado1 = ((parseInt(input1) * (dataEnjs[selectorigen].valor)) / (dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else
            resultado.innerHTML = input1;

        renderizarGrafica(dataEnjs, input1, selectorigen, selectaevaluar);
    }

    if(selectorigen === "libra_cobre" && (selectaevaluar === "dolar" || selectaevaluar === "euro" || selectaevaluar === "bitcoin"|| selectaevaluar === "uf"|| selectaevaluar === "libra_cobre")){

        if(selectaevaluar === "euro" || selectaevaluar === "uf" ){
            resultado1 = (((input1)*(dataEnjs[selectorigen].valor)*(dataEnjs.dolar.valor))/(dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else if (selectaevaluar === "dolar"){
            resultado1 = ((parseInt(input1) * (dataEnjs[selectorigen].valor))).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else if (selectaevaluar === "bitcoin"){
            resultado1 = ((parseInt(input1) * (dataEnjs[selectorigen].valor)) / (dataEnjs[selectaevaluar].valor)).toFixed(6);
            resultado.innerHTML = resultado1;
        }
        else
            resultado.innerHTML = input1;

        renderizarGrafica(dataEnjs, input1, selectorigen, selectaevaluar);
    }

}


async function renderizarGrafica(dataEnjs, input1, selectorigen, selectaevaluar){
    const objeto10valoresEnjs = await get10valores(dataEnjs, input1, selectorigen, selectaevaluar);

    if (myChart) {
        myChart.destroy();
    }

    const tipo = "line";
    let titulo = "COMPORTAMIENTO " + selectaevaluar.toUpperCase();
    const bordeColor = "red";
    const backgroundColor = "black";

    if(selectaevaluar === "uf"){
        titulo = "COMPORTAMIENTO UNIDAD DE FOMENTO"
    }

    const config = {
        type: tipo,
        data:{
            labels: diezValoresEjeAbcisas,
            datasets: [{
                label: titulo,
                backgroundColor: backgroundColor,
                borderColor: bordeColor,
                data: diezValoresEjeOrdenadas,
            }]
        }
    } 
    myChart = new Chart (chartDOM, config);
}


let diezValoresEjeAbcisas = [];
let diezValoresEjeOrdenadas = [];
let span = 0;

async function get10valores(dataEnjs, input1, selectorigen, selectaevaluar){
    let objeto10valores = 0; 
    let objeto10valoresEnjs = 0;
    diezValoresEjeAbcisas.splice(0,10);
    diezValoresEjeOrdenadas.splice(0,10);
    try{

        objeto10valores = await fetch(`https://mindicador.cl/api/${selectaevaluar}`);
        objeto10valoresEnjs = await objeto10valores.json();

        for(let i=0; i<10; i++){
        diezValoresEjeAbcisas.unshift(objeto10valoresEnjs.serie[i].fecha.substring(0,10));
        diezValoresEjeOrdenadas.unshift(objeto10valoresEnjs.serie[i].valor);
        }
    }
    catch (e){
        error1.innerHTML = `!Algo salió mal Error: ${e.message}`;
    }
}