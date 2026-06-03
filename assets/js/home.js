document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario?.nivel == "admin") {
        document.getElementById("Painel__adm").style.display = "block";
    }
});