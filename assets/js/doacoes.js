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
    }
];

let formDoacao;
let doacaoId;
let nomeInput;
let valorInput;
let mensagemInput;
let anonimoInput;
let listaDoacoes;
let btnSalvar;
let btnCancelar;
let totalDoacoes;
let valorTotal;

function iniciarLocalStorage() {

    if (!localStorage.getItem(STORAGE_KEY)) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(doacoesIniciais)
        );
    }
}

function iniciarUsuarioPadrao() {

    if (!localStorage.getItem(USUARIO_STORAGE_KEY)) {

        localStorage.setItem(
            USUARIO_STORAGE_KEY,
            JSON.stringify({
                nome: "Visitante",
                nivel: "usuario"
            })
        );
    }
}

function buscarUsuarioAtual() {

    return JSON.parse(
        localStorage.getItem(USUARIO_STORAGE_KEY)
    );
}

function usuarioEhAdmin() {

    return buscarUsuarioAtual().nivel === "admin";
}

function buscarDoacoes() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];
}

function salvarDoacoes(doacoes) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(doacoes)
    );
}

function gerarId(doacoes) {

    if (doacoes.length === 0) {

        return "1";
    }

    return String(
        Math.max(...doacoes.map(d => Number(d.id))) + 1
    );
}

function gerarDataAtual() {

    const hoje = new Date();

    return `${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
    ).padStart(2, "0")}-${String(
        hoje.getDate()
    ).padStart(2, "0")}`;
}

function formatarData(data) {

    const p = data.split("-");

    return `${p[2]}/${p[1]}/${p[0]}`;
}

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function atualizarResumo(doacoes) {

    totalDoacoes.textContent = doacoes.length;

    const soma = doacoes.reduce(
        (t, d) => t + Number(d.valor),
        0
    );

    valorTotal.textContent = formatarMoeda(soma);
}

function listarDoacoes() {

    const doacoes = buscarDoacoes();

    listaDoacoes.innerHTML = "";

    atualizarResumo(doacoes);

    if (doacoes.length === 0) {

        listaDoacoes.innerHTML =
            "<p>Nenhuma doação registrada.</p>";

        return;
    }

    doacoes.forEach(d => {

        const div = document.createElement("div");

        div.className = "doacao";

        let acoes = "";

        if (usuarioEhAdmin()) {

            acoes = `
            <div class="acoes">
                <button onclick="editarDoacao('${d.id}')">
                    Editar
                </button>

                <button class="btn-excluir"
                onclick="excluirDoacao('${d.id}')">
                    Excluir
                </button>
            </div>
            `;
        }

        div.innerHTML = `
            <div class="doacao-topo">

                <strong>
                    ${d.anonimo ? "Anônimo" : d.nome}
                </strong>

                <strong>
                    ${formatarMoeda(d.valor)}
                </strong>

            </div>

            <p>${d.mensagem}</p>

            <small>

                ${d.formaPagamento}

                •

                ${formatarData(d.data)}

                •

                ${d.status}

            </small>

            ${acoes}
        `;

        listaDoacoes.appendChild(div);
    });
}

function cadastrarDoacao(e) {

    e.preventDefault();

    const nome = nomeInput.value.trim();

    const valor = Number(valorInput.value);

    const mensagem = mensagemInput.value.trim();

    const anonimo = anonimoInput.checked;

    if (!anonimo && nome === "") {

        alert("Digite seu nome.");

        return;
    }

    if (valor <= 0) {

        alert("Digite um valor válido.");

        return;
    }

    if (mensagem === "") {

        alert("Digite uma mensagem.");

        return;
    }

    const doacoes = buscarDoacoes();

    const id = doacaoId.value;

    if (id) {

        const indice = doacoes.findIndex(
            d => d.id === id
        );

        doacoes[indice] = {

            ...doacoes[indice],

            nome: anonimo ? "Anônimo" : nome,

            valor,

            mensagem,

            anonimo
        };

        alert("Doação atualizada!");

    } else {

        doacoes.push({

            id: gerarId(doacoes),

            nome: anonimo ? "Anônimo" : nome,

            valor,

            mensagem,

            anonimo,

            formaPagamento: "PIX Simulado",

            data: gerarDataAtual(),

            status: "Registrada"
        });

        alert("Doação registrada!");
    }

    salvarDoacoes(doacoes);

    formDoacao.reset();

    doacaoId.value = "";

    btnSalvar.textContent = "Registrar doação";

    btnCancelar.style.display = "none";

    listarDoacoes();
}

function editarDoacao(id) {

    if (!usuarioEhAdmin()) {

        return;
    }

    const doacoes = buscarDoacoes();

    const doacao = doacoes.find(
        d => d.id === id
    );

    if (!doacao) return;

    doacaoId.value = doacao.id;

    nomeInput.value =

        doacao.anonimo

            ? ""

            : doacao.nome;

    valorInput.value = doacao.valor;

    mensagemInput.value = doacao.mensagem;

    anonimoInput.checked = doacao.anonimo;

    btnSalvar.textContent =

        "Salvar alterações";

    btnCancelar.style.display = "block";
}

function excluirDoacao(id) {

    if (!usuarioEhAdmin()) {

        return;
    }

    const confirmar = confirm(

        "Deseja excluir esta doação?"
    );

    if (!confirmar) return;

    let doacoes = buscarDoacoes();

    doacoes = doacoes.filter(

        d => d.id !== id
    );

    salvarDoacoes(doacoes);

    listarDoacoes();
}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        formDoacao = document.getElementById("formDoacao");

        doacaoId = document.getElementById("doacaoId");

        nomeInput = document.getElementById("nome");

        valorInput = document.getElementById("valor");

        mensagemInput = document.getElementById("mensagem");

        anonimoInput = document.getElementById("anonimo");

        listaDoacoes = document.getElementById("listaDoacoes");

        btnSalvar = document.getElementById("btnSalvar");

        btnCancelar = document.getElementById("btnCancelar");

        totalDoacoes = document.getElementById("totalDoacoes");

        valorTotal = document.getElementById("valorTotal");

        iniciarLocalStorage();

        iniciarUsuarioPadrao();

        listarDoacoes();

        btnCancelar.style.display = "none";

        formDoacao.addEventListener(
            "submit",
            cadastrarDoacao
        );

        btnCancelar.addEventListener(

            "click",

            () => {

                formDoacao.reset();

                doacaoId.value = "";

                btnSalvar.textContent =

                    "Registrar doação";

                btnCancelar.style.display =

                    "none";
            }
        );

        document.getElementById("btnInicio")
        ?.addEventListener("click", () => {

            window.location.href = "home.html";
        });

        document.getElementById("btnMural")
        ?.addEventListener("click", () => {

            window.location.href = "mural.html";
        });

    }

);