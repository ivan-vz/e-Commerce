let emailName = localStorage.getItem("email"); // A la variable "emailName" le asigno el valor asignado por "email" en el localStorage
document.getElementById("emailLogin").innerHTML = emailName; // Ubico ala etiqueta (Ubicado en inicio.html) con id "emailLogin" y le agrego como contenido a la variable emailName

document.getElementById("volverArriba").addEventListener("click", () => {
    window.location = "#";
});