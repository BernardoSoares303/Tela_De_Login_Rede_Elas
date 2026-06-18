const CHAVE_POSTITS = "postitsMuralRedeApoio";
const USUARIO_STORAGE_KEY = "usuarioLogado";

const postitsIniciais = [
    {
        id: 1,
        titulo: "Você não está sozinha",
        mensagem: "Buscar ajuda é um ato de coragem. Existem pessoas e serviços preparados para acolher você.",
        categoria: "Apoio",
        cor: "rosa",
        fixado: true,
        dataCriacao: "2026-05-17",
        autor: "Equipe Admin"
    },
    {
        id: 2,
        titulo: "Canal 180",
        mensagem: "A Central de Atendimento à Mulher oferece orientação e recebe denúncias de violência contra a mulher.",
        categoria: "Orientação",
        cor: "lilas",
        fixado: false,
        dataCriacao: "2026-05-17",
        autor: "Equipe Admin"
    },
    {
        id: 3,
        titulo: "Mensagem de força",
        mensagem: "Sua história importa. Informação, acolhimento e apoio podem ajudar no primeiro passo.",
        categoria: "Superação",
        cor: "amarelo",
        fixado: false,
        dataCriacao: "2026-05-17",
        autor: "Equipe Admin"
    }
];

const formPostit = document.getElementById("formPostit");
const areaFormulario = document.getElementById("areaFormulario");

const inputId = document.getElementById("postitId");
const inputTitulo = document.getElementById("titulo");
const inputMensagem = document.getElementById("mensagem");
const inputCategoria = document.getElementById("categoria");
const inputCor = document.getElementById("cor");

const listaPostits = document.getElementById("listaPostits");

const contador = document.getElementById("contador");
const pesquisa = document.getElementById("pesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");

const totalPostits = document.getElementById("totalPostits");
const totalFixados = document.getElementById("totalFixados");

const btnCancelar = document.getElementById("btnCancelar");
const btnSalvar = document.getElementById("btnSalvar");

function iniciarLocalStorage() {

    if (!localStorage.getItem(CHAVE_POSTITS)) {

        localStorage.setItem(
            CHAVE_POSTITS,
            JSON.stringify(postitsIniciais)
        );

    }

}

function buscarUsuarioAtual() {

    const usuario = localStorage.getItem("usuarioLogado");

    if (!usuario) return null;

    try {

        return JSON.parse(usuario);

    } catch {

        return null;

    }
}

function usuarioEhAdmin() {

    const usuario = buscarUsuarioAtual();

    return usuario && usuario.nivel === "admin";

}

function atualizarPainelAcesso() {

    const usuario = buscarUsuarioAtual();

    if (!usuario) {

        areaFormulario.style.display = "none";

        return;
    }

    if (usuarioEhAdmin()) {

        areaFormulario.style.display = "block";

    } else {

        areaFormulario.style.display = "none";

    }

}

function buscarPostits() {

    return JSON.parse(
        localStorage.getItem(CHAVE_POSTITS)
    ) || [];

}

function salvarPostits(postits) {

    localStorage.setItem(
        CHAVE_POSTITS,
        JSON.stringify(postits)
    );

}

function gerarId(postits) {

    if (postits.length === 0) {

        return 1;

    }

    return Math.max(
        ...postits.map(p => Number(p.id))
    ) + 1;

}

function gerarDataAtual() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}

function formatarData(data) {

    if (!data) return "";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

function criarPostit(dados) {

    if (!usuarioEhAdmin()) {

        alert(
            "Somente administradores podem publicar."
        );

        return;

    }

    const usuario = buscarUsuarioAtual();

    const postits = buscarPostits();

    postits.push({

        id: gerarId(postits),

        titulo: dados.titulo,

        mensagem: dados.mensagem,

        categoria: dados.categoria,

        cor: dados.cor,

        fixado: false,

        dataCriacao: gerarDataAtual(),

        autor: usuario.nome

    });

    salvarPostits(postits);

}

function atualizarPostit(id, dados) {

    if (!usuarioEhAdmin()) {

        alert(
            "Somente administradores podem editar."
        );

        return;

    }

    const postits = buscarPostits().map(p => {

        if (Number(p.id) === Number(id)) {

            return {

                ...p,

                titulo: dados.titulo,

                mensagem: dados.mensagem,

                categoria: dados.categoria,

                cor: dados.cor

            };

        }

        return p;

    });

    salvarPostits(postits);

}

function excluirPostit(id) {

    if (!usuarioEhAdmin()) {

        alert(
            "Somente administradores podem excluir."
        );

        return;

    }

    if (!confirm(
        "Deseja excluir este post-it?"
    )) {

        return;

    }

    const postits = buscarPostits().filter(

        p => Number(p.id) !== Number(id)

    );

    salvarPostits(postits);

    carregarPostits();

}

function fixarPostit(id) {

    if (!usuarioEhAdmin()) {

        alert(
            "Somente administradores podem fixar."
        );

        return;

    }

    const postits = buscarPostits().map(p => {

        if (Number(p.id) === Number(id)) {

            p.fixado = !p.fixado;

        }

        return p;

    });

    salvarPostits(postits);

    carregarPostits();

}

function prepararEdicao(id) {

    if (!usuarioEhAdmin()) {

        alert(
            "Somente administradores podem editar."
        );

        return;

    }

    const postit = buscarPostits().find(

        p => Number(p.id) === Number(id)

    );

    if (!postit) return;

    inputId.value = postit.id;

    inputTitulo.value = postit.titulo;

    inputMensagem.value = postit.mensagem;

    inputCategoria.value = postit.categoria;

    inputCor.value = postit.cor;

    btnSalvar.textContent =
        "Salvar alterações";

    btnCancelar.style.display =
        "inline-block";

    atualizarContador();

    areaFormulario.scrollIntoView({

        behavior: "smooth"

    });

}

function limparFormulario() {

    formPostit.reset();

    inputId.value = "";

    btnSalvar.textContent =
        "Publicar post-it";

    btnCancelar.style.display =
        "none";

    atualizarContador();

}

function obterDadosFormulario() {

    return {

        titulo:
            inputTitulo.value.trim(),

        mensagem:
            inputMensagem.value.trim(),

        categoria:
            inputCategoria.value,

        cor:
            inputCor.value

    };

}

function validarDados(dados) {

    if (dados.titulo.length < 3) {

        alert(
            "Título muito curto."
        );

        return false;

    }

    if (dados.mensagem.length < 10) {

        alert(
            "Mensagem muito curta."
        );

        return false;

    }

    return true;

}

function carregarPostits() {

    atualizarPainelAcesso();

    let postits = buscarPostits();

    const termo =
        pesquisa.value.toLowerCase().trim();

    const categoria =
        filtroCategoria.value;

    totalPostits.textContent =
        postits.length;

    totalFixados.textContent =
        postits.filter(
            p => p.fixado
        ).length;

    if (categoria !== "Todas") {

        postits = postits.filter(

            p => p.categoria === categoria

        );

    }

    if (termo) {

        postits = postits.filter(

            p =>

                p.titulo.toLowerCase().includes(termo)

                ||

                p.mensagem.toLowerCase().includes(termo)

        );

    }

    postits.sort((a, b) => {

        if (a.fixado === b.fixado) {

            return b.id - a.id;

        }

        return a.fixado ? -1 : 1;

    });

    listaPostits.innerHTML = "";

    if (postits.length === 0) {

        listaPostits.innerHTML =

            `<div class="vazio">
                <h3>Nenhum post-it encontrado</h3>
                <p>Quando um administrador publicar uma mensagem ela aparecerá aqui.</p>
            </div>`;

        return;

    }

    postits.forEach(p => {

        const acoes = usuarioEhAdmin()

            ?

            `<div class="acoes">

                <button onclick="fixarPostit(${p.id})">

                    ${p.fixado ? "Desfixar" : "Fixar"}

                </button>

                <button onclick="prepararEdicao(${p.id})">

                    Editar

                </button>

                <button class="btn-excluir"

                    onclick="excluirPostit(${p.id})">

                    Excluir

                </button>

            </div>`

            :

            "";

        listaPostits.innerHTML += `

        <article class="postit ${p.cor} ${p.fixado ? "fixado" : ""}">

            <h3>${p.titulo}</h3>

            <p>${p.mensagem}</p>

            <div class="meta">

                ${p.categoria}

                •

                ${p.autor}

                •

                ${formatarData(p.dataCriacao)}

            </div>

            ${acoes}

        </article>

        `;

    });

}

function atualizarContador() {

    contador.textContent =
        inputMensagem.value.length;

}

formPostit.addEventListener("submit", e => {

    e.preventDefault();

    const dados =
        obterDadosFormulario();

    if (!validarDados(dados))
        return;

    if (inputId.value) {

        atualizarPostit(

            inputId.value,

            dados

        );

        alert("Post-it atualizado!");

    }

    else {

        criarPostit(dados);

        alert("Post-it publicado!");

    }

    limparFormulario();

    carregarPostits();

});

btnCancelar.addEventListener(
    "click",
    limparFormulario
);

inputMensagem.addEventListener(
    "input",
    atualizarContador
);

pesquisa.addEventListener(
    "input",
    carregarPostits
);

filtroCategoria.addEventListener(
    "change",
    carregarPostits
);

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("btnInicio")
        .addEventListener("click", () => {

            window.location.href =
                "home.html";

        });

    document
        .getElementById("btnDoacoes")
        .addEventListener("click", () => {

            window.location.href =
                "doacoes.html";

        });

});

iniciarLocalStorage();

carregarPostits();

atualizarContador();