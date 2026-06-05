document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario?.nivel == "admin") {
        document.getElementById("Painel__adm").style.display = "block";
    }

    const logoutBtn = document.getElementById("Logout");
    logoutBtn.addEventListener("click", (e) => {
        logout();
    })
});


function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}