function IrTelaCadastro() {
    window.location.href = "cadastro.html";
}



document.addEventListener("DOMContentLoaded", () => {
    const botao = document.querySelector("#CriarConta");
    botao.addEventListener("click", (e) => {
        IrTelaCadastro();
    })
})