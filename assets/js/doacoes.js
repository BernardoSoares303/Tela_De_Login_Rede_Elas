document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("btnInicio")
        .addEventListener("click", () => {
            window.location.href = "home.html";
        });

});


const STORAGE_KEY = "doacoesPix";
const USUARIO_STORAGE_KEY = "usuarioLogado";

const doacoesIniciais = [
  {
    id: "1",
    nome: "Anônimo",
    valor: 20,
    mensagem: "Apoio essa causa.",
    anonimo: true,
    formaPagamento: "PIX Simulado",
    data: "2026-05-17",
    status: "Registrada"
  },
  {
    id: "2",
    nome: "Roberto",
    valor: 10,
    mensagem: "Toda ajuda importa.",
    anonimo: false,
    formaPagamento: "PIX Simulado",
    data: "2026-05-17",
    status: "Registrada"
  },
  {
    id: "3",
    nome: "Maria Clara",
    valor: 30,
    mensagem: "Juntas somos mais fortes!",
    anonimo: false,
    formaPagamento: "PIX Simulado",
    data: "2026-05-17",
    status: "Registrada"
  }
];

const formDoacao = document.getElementById("formDoacao");
const doacaoId = document.getElementById("doacaoId");
const nomeInput = document.getElementById("nome");
const valorInput = document.getElementById("valor");
const mensagemInput = document.getElementById("mensagem");
const anonimoInput = document.getElementById("anonimo");
const listaDoacoes = document.getElementById("listaDoacoes");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const totalDoacoes = document.getElementById("totalDoacoes");
const valorTotal = document.getElementById("valorTotal");
const perfilAtual = document.getElementById("perfilAtual");
const infoPermissao = document.getElementById("infoPermissao");
const btnEntrarUsuario = document.getElementById("btnEntrarUsuario");
const btnEntrarAdmin = document.getElementById("btnEntrarAdmin");

function iniciarLocalStorage() {
  const doacoes = localStorage.getItem(STORAGE_KEY);

  if (!doacoes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doacoesIniciais));
  }
}

function iniciarUsuarioPadrao() {
  const usuarioSalvo = localStorage.getItem(USUARIO_STORAGE_KEY);

  if (!usuarioSalvo) {
    definirUsuarioAtual({ nome: "Visitante", nivel: "usuario" });
  }
}

function buscarUsuarioAtual() {
  return JSON.parse(localStorage.getItem(USUARIO_STORAGE_KEY)) || { nome: "Visitante", nivel: "usuario" };
}

function definirUsuarioAtual(usuario) {
  localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario));
}

function usuarioEhAdmin() {
  const usuario = buscarUsuarioAtual();
  return usuario && usuario.nivel === "admin";
}

function atualizarPainelAcesso() {
  const usuario = buscarUsuarioAtual();
  const admin = usuarioEhAdmin();

  perfilAtual.textContent = admin ? `${usuario.nome} (Administrador)` : `${usuario.nome} (Usuário comum)`;
  infoPermissao.textContent = admin
    ? "Como administrador, você pode editar e excluir doações registradas."
    : "Somente administradores podem editar e excluir doações registradas.";

  btnEntrarUsuario.classList.toggle("ativo-modo", !admin);
  btnEntrarAdmin.classList.toggle("ativo-modo", admin);
}

function buscarDoacoes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarDoacoes(doacoes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doacoes));
}

function gerarId(doacoes) {
  if (doacoes.length === 0) {
    return "1";
  }

  const maiorId = doacoes.reduce((maior, doacao) => {
    const idAtual = Number(doacao.id);
    return idAtual > maior ? idAtual : maior;
  }, 0);

  return String(maiorId + 1);
}

function listarDoacoes() {
  const doacoes = buscarDoacoes();
  listaDoacoes.innerHTML = "";

  atualizarResumo(doacoes);
  atualizarPainelAcesso();

  if (doacoes.length === 0) {
    listaDoacoes.innerHTML = `<p class="mensagem-vazia">Nenhuma doação registrada ainda.</p>`;
    return;
  }

  doacoes.forEach((doacao) => {
    const div = document.createElement("div");
    div.classList.add("doacao");

    const acoesAdmin = usuarioEhAdmin()
      ? `
        <div class="acoes">
          <button onclick="editarDoacao('${doacao.id}')">Editar</button>
          <button class="btn-excluir" onclick="excluirDoacao('${doacao.id}')">Excluir</button>
        </div>
      `
      : `<p class="permissao-admin">Edição e exclusão liberadas apenas para administradores.</p>`;

    div.innerHTML = `
      <div class="doacao-topo">
        <span class="doacao-nome">${doacao.anonimo ? "Anônimo" : doacao.nome}</span>
        <span class="doacao-valor">${formatarMoeda(doacao.valor)}</span>
      </div>
      <p>${doacao.mensagem}</p>
      <p class="doacao-data">${doacao.formaPagamento} • ${formatarData(doacao.data)} • ${doacao.status}</p>
      ${acoesAdmin}
    `;

    listaDoacoes.appendChild(div);
  });
}

function atualizarResumo(doacoes) {
  totalDoacoes.textContent = doacoes.length;

  const soma = doacoes.reduce((total, doacao) => {
    return total + Number(doacao.valor);
  }, 0);

  valorTotal.textContent = formatarMoeda(soma);
}

function cadastrarDoacao(event) {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const valor = Number(valorInput.value);
  const mensagem = mensagemInput.value.trim();
  const anonimo = anonimoInput.checked;

  if (!anonimo && nome === "") {
    alert("Digite seu nome ou marque a opção para doar anonimamente.");
    return;
  }

  if (!valor || valor <= 0) {
    alert("Digite um valor válido para a doação.");
    return;
  }

  if (mensagem === "") {
    alert("Digite uma mensagem de apoio.");
    return;
  }

  const doacoes = buscarDoacoes();

  if (doacaoId.value) {
    if (!usuarioEhAdmin()) {
      alert("Somente administradores podem editar doações.");
      limparFormulario();
      return;
    }

    const doacoesAtualizadas = doacoes.map((doacao) => {
      if (doacao.id === doacaoId.value) {
        return {
          ...doacao,
          nome: anonimo ? "Anônimo" : nome,
          valor,
          mensagem,
          anonimo
        };
      }

      return doacao;
    });

    salvarDoacoes(doacoesAtualizadas);
    alert("Doação atualizada com sucesso!");
  } else {
    const novaDoacao = {
      id: gerarId(doacoes),
      nome: anonimo ? "Anônimo" : nome,
      valor,
      mensagem,
      anonimo,
      formaPagamento: "PIX Simulado",
      data: gerarDataAtual(),
      status: "Registrada"
    };

    doacoes.push(novaDoacao);
    salvarDoacoes(doacoes);
    alert("Doação registrada com sucesso!");
  }

  limparFormulario();
  listarDoacoes();
}

function editarDoacao(id) {
  if (!usuarioEhAdmin()) {
    alert("Somente administradores podem editar doações.");
    return;
  }

  const doacoes = buscarDoacoes();
  const doacao = doacoes.find((item) => item.id === id);

  if (!doacao) {
    alert("Doação não encontrada.");
    return;
  }

  doacaoId.value = doacao.id;
  nomeInput.value = doacao.anonimo ? "" : doacao.nome;
  valorInput.value = doacao.valor;
  mensagemInput.value = doacao.mensagem;
  anonimoInput.checked = doacao.anonimo;

  btnSalvar.textContent = "Salvar alteração";
  btnCancelar.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirDoacao(id) {
  if (!usuarioEhAdmin()) {
    alert("Somente administradores podem excluir doações.");
    return;
  }

  const confirmar = confirm("Tem certeza que deseja excluir esta doação?");

  if (!confirmar) {
    return;
  }

  const doacoes = buscarDoacoes();
  const doacoesAtualizadas = doacoes.filter((doacao) => doacao.id !== id);

  salvarDoacoes(doacoesAtualizadas);
  listarDoacoes();
}

function limparFormulario() {
  formDoacao.reset();
  doacaoId.value = "";
  btnSalvar.textContent = "Registrar doação";
  btnCancelar.style.display = "none";
}

function formatarData(data) {
  if (!data) {
    return "";
  }

  const partes = data.split("-");

  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return data;
}

function gerarDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

btnCancelar.addEventListener("click", limparFormulario);
formDoacao.addEventListener("submit", cadastrarDoacao);

btnEntrarUsuario.addEventListener("click", function () {
  definirUsuarioAtual({ nome: "Visitante", nivel: "usuario" });
  limparFormulario();
  listarDoacoes();
});

btnEntrarAdmin.addEventListener("click", function () {
  definirUsuarioAtual({ nome: "Equipe Admin", nivel: "admin" });
  limparFormulario();
  listarDoacoes();
});

iniciarLocalStorage();
iniciarUsuarioPadrao();
listarDoacoes();
