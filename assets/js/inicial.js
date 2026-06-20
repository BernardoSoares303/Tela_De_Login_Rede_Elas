function IrTelaCadastro() {
    window.location.href = "cadastro.html";
}

function IrTelaLogin() {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // EventListener Do botão de Fazer Cadastro
    const cadastro = document.querySelector("#CriarConta");
    cadastro.addEventListener("click", (e) => {
        IrTelaCadastro();
    })

    // EventListener Do botão de Fazer Login
    const login = document.querySelector("#Login");
    login.addEventListener("click", (e) => {
        IrTelaLogin();
    })
})