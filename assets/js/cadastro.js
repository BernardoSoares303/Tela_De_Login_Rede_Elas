document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".Cadastro-Usuario");

    // Listener para o envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const senha = document.getElementById("password").value;

            // Tem que validar se a senha tem letra pq o json server é bugado e nao sabe tratar string != int
            if (!validarSenha(senha)) {
                alert("A senha deve conter pelo menos uma letra!");
                return; // impede o cadastro
            }

            const usuario = {
                nome: document.getElementById("name").value,
                cpf: document.getElementById("cpf").value,
                email: document.getElementById("email").value,
                senha: senha,
                nivel: "usuario",
                dataCriacao: new Date().toISOString().split("T")[0]
            };

            await cadastrarUsuario(usuario);

            window.location.href = "home.html";

        } catch (erro) {
            console.error(erro);
            alert("Erro ao cadastrar");
        }
    });
});

// Função de validação
function validarSenha(senha) {
    return /[a-zA-Z]/.test(senha);
}

// Função para cadastrar usuário
async function cadastrarUsuario(usuario) {
    const resposta = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });
}