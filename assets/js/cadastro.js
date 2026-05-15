const form = document.querySelector(".Cadastro-Usuario");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // impede recarregar a página

  const usuario = {
    nome: document.getElementById("name").value,
    cpf: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    senha: document.getElementById("password").value,
    nivel: "usuario",
    dataCriacao: new Date().toISOString().split("T")[0]
  };

  await cadastrarUsuario(usuario);
});

async function cadastrarUsuario(usuario) {
  const res = await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  });

  const dados = await res.json();

  alert("Usuário cadastrado com sucesso!");
  console.log(dados);
}