const api = "http://localhost:3000/usuarios"; // api em variavel para poder ser reutilizada em todas as funções
const lista = document.getElementById("lista");

let modal;

// INICIAR
document.addEventListener("DOMContentLoaded", () => {
  modal = new bootstrap.Modal(document.getElementById("modalEditar"));
  carregarUsuarios();
});

async function carregarUsuarios() {
  lista.innerHTML = "";

  const res = await fetch(api);
  const usuarios = await res.json();

  usuarios.forEach(usuario => {
    const item = document.createElement("div");

    item.className = "list-group-item d-flex justify-content-between align-items-center";

    item.innerHTML = `
      <div>
        <h5>${usuario.nome}</h5>
        <small>${usuario.email}</small>
      </div>

      <div>
        <button class="btn btn-warning btn-sm me-2"
          onclick="abrirModal('${usuario.id}')">
          Editar
        </button>

        <button class="btn btn-danger btn-sm"
          onclick="excluir('${usuario.id}')">
          Excluir
        </button>
      </div>
    `;

    lista.appendChild(item);
  });
}

// ABRIR MODAL
async function abrirModal(id) {
  const res = await fetch(`${api}/${id}`);
  const usuario = await res.json();

  document.getElementById("editId").value = usuario.id;
  document.getElementById("editNome").value = usuario.nome;
  document.getElementById("editEmail").value = usuario.email;
  document.getElementById("editCpf").value = usuario.cpf;
  document.getElementById("editNivel").value = usuario.nivel;

  modal.show();
}

// SALVAR
async function salvarEdicao() {
  const id = document.getElementById("editId").value;

  const dados = {
    nome: document.getElementById("editNome").value,
    email: document.getElementById("editEmail").value,
    cpf: document.getElementById("editCpf").value,
    nivel: document.getElementById("editNivel").value
  };

  await fetch(`${api}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  modal.hide();
  carregarUsuarios();
}

// EXCLUIR
async function excluir(id) {
  if (!confirm("Deseja excluir?")) return;

  await fetch(`${api}/${id}`, {
    method: "DELETE"
  });

  carregarUsuarios();
}