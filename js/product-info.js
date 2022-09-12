let productId = localStorage.getItem("PID"); // ID del producto al que entrmos
const urlProductsInfo = "https://japceibal.github.io/emercado-api/products/"+ productId + ".json" // Link para poder entrar al product-info del producto especifico
const opiniones = "https://japceibal.github.io/emercado-api/products_comments/"+ productId + ".json";
let producto = [];
let comment = [];

//Funcion para conseguir los datos de un producto
document.addEventListener("DOMContentLoaded",async function(e){
    producto =  await getJSONData(urlProductsInfo);
    showProductInfo(producto.data);
    comment =  await getJSONData(opiniones);

    if(JSON.parse(localStorage.getItem("ListaComentarios"+productId)) == null){
        localStorage.setItem("ListaComentarios"+productId, JSON.stringify(comment.data));
        showComments();
    } else {
        showComments();
    }
});

//Funcion para mandar los comentarios fijos y nuevos al html
function showComments(){
    document.getElementById("Comentarios").innerHTML = ""; 
    let comments = JSON.parse(localStorage.getItem("ListaComentarios"+productId));
    let estrellas;
    comments.forEach(element => {
        let Us_Da = `<li class="list-group-item"><strong>${element.user}</strong> - ${element.dateTime} `;
        switch (element.score){
            case 1: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 2: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 3: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 4: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 5: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>

            `
            break;
        }
        let Des = `<br>${element.description}</li>`;
        document.getElementById("Comentarios").innerHTML += Us_Da + estrellas + Des; 
    });
}


//Funcion para mandar toda la informacion del producto al html
function showProductInfo(product){
    let datos = "";
    let imagenes = ""
    datos = `
        <li class="list-group-item">
                <div>
                    <h2 class="titulo">${product.name}</h2>
                    <hr>
                    <h5 class="titulo">Precio</h5>
                    <p class="textos">${product.currency} ${product.cost}</p>
                    <h5 class="titulo">Descripción</h5>
                    <p class="textos"> ${product.description}</p>
                    <h5 class="titulo">Categoría</h5>
                    <p class="textos"> ${product.category}</p>
                    <h5 class="titulo">Cantidad de vendidos</h5>
                    <p class="textos"> ${product.soldCount}</p>
                </div>
        </li>
     `

    for(imag of product.images){
            imagenes +=  `       
                <div class="col galCol">
                    <img src="${imag}" class="img-thumbnail" onclick="expand(this);">
                </div>
        `;

        document.getElementById("fotoExt").innerHTML = `<img id="expandedImg" src="${product.images[0]}"  class="img-thumbnail" style="width:100%">`;
        document.getElementById("galeria").innerHTML = imagenes; 
    }

    document.getElementById("informacion").innerHTML = datos; 

}

// Comentar
let lista = document.getElementById("contenedor");
let comentar = document.getElementById("enviar");

comentar.addEventListener("click",() => {
    let date = new Date();
    let nuevoCom = {
        "product": productId,
        "score": parseInt(document.getElementById("tuPuntuacion").value),
        "description": document.getElementById("tuOpinion").value,
        "user": "Usuario",
        "dateTime": date.toISOString().split('T')[0] + " " + date.toLocaleTimeString()
    }
    comment.data.unshift(nuevoCom);
    localStorage.setItem("ListaComentarios"+productId, JSON.stringify(comment.data));
    showComments();
})

//Funcion al hacer click en una de las foto miniatura
function expand(imgs) {
    // Consigo el <img> de la foto extendida
    let expandImg = document.getElementById("expandedImg");
    // Sobrecargo el src de la imagen extendida por el de la imagen clickeada
    expandImg.src = imgs.src;
  }

//Botones para volver a productos  arriba
document.getElementById("volverProducts").addEventListener("click", () => {
    window.location = "products.html";
});