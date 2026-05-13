function IrTelaCadastro() {
    window.location.href = "cadastro.html";
}

function IrTelaLogin() {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const cadastro = document.querySelector("#CriarConta");
    cadastro.addEventListener("click", (e) => {
        IrTelaCadastro();
    })

    const login = document.querySelector("#Login");
    login.addEventListener("click", (e) => {
        IrTelaLogin();
    })
})