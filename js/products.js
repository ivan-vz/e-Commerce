//Variables

//Datos y url
let codigo = localStorage.getItem("catID");
const url = PRODUCTS_URL + codigo + EXT_TYPE;

//Array de para los filtrados
let mercancia = [];
let newList = [];

//Filtros de valor
let minCount;
let maxCount;

//Filtros segun Pantalla
let minChico = document.getElementById("rangeFilterCountMinChico");
let maxChico = document.getElementById("rangeFilterCountMaxChico");
let minGrande = document.getElementById("rangeFilterCountMinGrande");
let maxGrande = document.getElementById("rangeFilterCountMaxGrande");
let buscChico = document.getElementById("buscadorChico");
let buscGrande = document.getElementById("buscadorGrande");

//Botones
let btnFiltroC = document.getElementById("rangeFilterCountChico");
let btnFiltroG = document.getElementById("rangeFilterCountGrande");
let btnLimpiarC = document.getElementById("clearRangeFilterChico");
let btnLimpiarG = document.getElementById("clearRangeFilterGrande");

//Funcion para conseguir los datos
document.addEventListener("DOMContentLoaded", async function (e) {
    verificarInicioDeSesion();
    mercancia = (await getJSONData(url)).data;
    showProductsList(mercancia.products);
    document.getElementById("tituloSecundario").innerHTML = `Verás aquí todos los productos de la categoría  ${mercancia.catName}`;
});

//Función que recibe un array con los datos de los productos y los muestra en pantalla
function showProductsList(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let product = array[i];
        htmlContentToAppend += `
    <div class="row row-cols justify-content-center" id="${product.name}">
        <div class="list-group-item list-group-item-action cursor-active d-none d-lg-block d-md-block" onclick="setProductID(${product.id})">
            <div class="row"> 
                <div class="col-3">
                    <img src="${product.image}" alt="product image" class="img-thumbnail"> 
                </div>
                <div class="col">
                    <div class="d-flex justify-content-between">
                        <div>
                        <h4>${product.name} - ${product.currency}${product.cost}</h4> 
                        <p>${product.description}</p> 
                        </div>
                        <small class="text-muted">${product.soldCount} vendidos</small> 
                    </div>
                </div>
            </div>
        </div>

        <div class="card cursor-active d-sm-block d-lg-none d-md-none my-2" style="width: 18rem;" onclick="setProductID(${product.id})">
            <img class="card-img-top" src="${product.image}" alt="product image">
            <div class="card-body">
                <h5 class="card-title">${product.name} - ${product.currency}${product.cost}</h5>
                <p class="card-text">${product.description}</p>
                <small class="text-muted">${product.soldCount} vendidos</small>
            </div>
        </div>
    </div>
     `
    }
    document.getElementById("Lista_De_Productos").innerHTML = htmlContentToAppend;
}

//Filtros
btnFiltroC.addEventListener("click", () => {
    minCount = minChico.value;
    maxCount = maxChico.value;
    rangoPrecio();
});

btnFiltroG.addEventListener("click", () => {
    minCount = minGrande.value;
    maxCount = maxGrande.value;
    rangoPrecio();
});

const rangoPrecio = () => {
    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
        minCount = parseInt(minCount);
    }
    else {
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
        maxCount = parseInt(maxCount);
    }
    else {
        maxCount = undefined;
    }

    if ((minCount == undefined) && (maxCount == undefined)) {
        showProductsList(mercancia.products);
    } else {
        newList = mercancia.products.filter(entreMaxMin);
        showProductsList(newList);
    }
};

//Funcion que recibe un array y lo filtra segun un margen de precio
function entreMaxMin(prod) {
    if (minCount == undefined) {
        return (prod.cost <= maxCount);
    } else if (maxCount == undefined) {
        return (prod.cost >= minCount);
    } else {
        return (prod.cost >= minCount) && (prod.cost <= maxCount);
    }
};

//Funcion que al clickear "Limpiar" reinicia todos los elementos en pantalla
btnLimpiarC.addEventListener("click", () => {
    limpiar();
});

btnLimpiarG.addEventListener("click", () => {
    limpiar();
});

const limpiar = () => {
    minChico.value = "";
    maxChico.value = "";
    minGrande.value = "";
    maxGrande.value = "";
    buscChico.value = "";
    buscGrande.value = "";

    minCount = undefined;
    maxCount = undefined;
    newList = [];

    showProductsList(mercancia.products);
};

//Funciones para ordenar segun lo seleccionado 
document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowProducts(1, newList);
});

document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowProducts(2, newList);
});

document.getElementById("sortByCount").addEventListener("click", function () {
    sortAndShowProducts(3, newList);
});

//Funcion que controla si se puso algun filtro o no
function sortAndShowProducts(codEsp, arrayActual) {
    if (arrayActual.length == 0) {
        newList = sortProducts(codEsp, mercancia.products);
    } else {
        newList = sortProducts(codEsp, arrayActual);
    }
    showProductsList(newList);
}

//Funcion que ordena dependiendo de la elección
function sortProducts(codEsp, arrayActual) {
    let result = [];
    if (codEsp === 1) {
        result = arrayActual.sort(function (a, b) {
            return b.cost - a.cost;
        });
    } else if (codEsp === 2) {
        result = arrayActual.sort(function (a, b) {
            return a.cost - b.cost;
        });
    } else if (codEsp === 3) {
        result = arrayActual.sort(function (a, b) {
            return b.soldCount - a.soldCount;
        });
    }
    return result;
}

//Buscador
//Funcion que filtra los objetos a tiempo real con el input de "buscar..."
const fBChico = () => {
    let palabraEscrita = buscChico.value.toLowerCase();
    Fbuscador(palabraEscrita);
};

const fBGrande = () => {
    let palabraEscrita = buscGrande.value.toLowerCase();
    Fbuscador(palabraEscrita);
};

function Fbuscador(palabraEscrita) {

    ListaBusc = [];

    if (newList.length == 0) {
        mercancia.products.forEach((merc) => {
            if (merc.name.toLowerCase().includes(palabraEscrita) || merc.description.toLowerCase().includes(palabraEscrita)) {
                ListaBusc.push(merc);
            }
        });

        if (ListaBusc.length == 0) {
            showProductsList(mercancia.products);
        } else {
            showProductsList(ListaBusc);
        }
    } else {
        newList.forEach((merc) => {
            if (merc.name.toLowerCase().includes(palabraEscrita) || merc.description.toLowerCase().includes(palabraEscrita)) {
                ListaBusc.push(merc);
            }
        });
        if (ListaBusc.length == 0) {
            showProductsList(newList);
        } else {
            showProductsList(ListaBusc);
        }
    }
}