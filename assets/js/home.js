// Variável global para armazenar a postagem selecionada para denúncia
let postagemSelecionada = null;

// Puxa o Usuario Logado do localStorage para poder usar suas infmações, como o ID para criar denúncias e o nível para mostrar o painel do admin
const usuario = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

// Carregar postagens ao iniciar
window.onload = () => {
    inicializarDados();
    carregarDados();
};

// Função para inicializar dados padrão no localStorage se não existirem
function inicializarDados() {
    if (!localStorage.getItem('postagens')) {
        const postagensPadrao = [
            {
                "id": 1,
                "titulo": "Meu namorado apos uma discussão me pediu desculpas...",
                "conteudo": "Meu namorado apos uma discussão me pediu desculpas, e mudou após o ocorrido, não aceitem menos que isso!",
                "usuarioId": "W0Ho0AM2ZRw",
                "comunidadeId": 1,
                "anonimo": true,
                "status": "aprovado",
                "dataCriacao": "2026-06-15"
            },
            {
                "id": 2,
                "titulo": "Ontem meu chefe me assediou no trabalho...",
                "conteudo": "Ontem meu chefe me assediou no trabalho, ele me chamou para uma reunião e fez comentários inapropriados sobre minha aparência. Me senti muito desconfortável e não sei o que fazer.",
                "usuarioId": "bLvJrFOGQ_I",
                "comunidadeId": 1,
                "anonimo": true,
                "status": "aprovado",
                "dataCriacao": "2026-06-14"
            }
        ];
        localStorage.setItem('postagens', JSON.stringify(postagensPadrao));
    }

    if (!localStorage.getItem('avaliacoes')) {
        localStorage.setItem('avaliacoes', JSON.stringify([]));
    }
}
// Função para carregar dados de postagens e avaliações do localStorage
function carregarDados() {
    const postagens = JSON.parse(localStorage.getItem('postagens')) || [];
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
    
    renderizarFeed(postagens, avaliacoes);
    configurarEventosVotacao();
    configurarEventosDenuncia();
}

// Função para renderizar o feed de postagens
function renderizarFeed(postagens, avaliacoes) {
    const container = document.getElementById('relatos-container');
    container.innerHTML = '';

    postagens.forEach(post => {
        const upvotes = avaliacoes.filter(v => v.postagemId.toString() === post.id.toString() && v.tipoVoto === 'upvote').length;
        const downvotes = avaliacoes.filter(v => v.postagemId.toString() === post.id.toString() && v.tipoVoto === 'downvote').length;
        const totalVotos = upvotes - downvotes;

        const meuVoto = usuario ? avaliacoes.find(v => v.postagemId.toString() === post.id.toString() && v.usuarioId.toString() === usuario.id.toString()) : null;
        const tipoMeuVoto = meuVoto ? meuVoto.tipoVoto : null;

        const card = document.createElement('div');
        card.className = 'relato-card';
        card.dataset.id = post.id;
        card.innerHTML = `
            <div class="relato-card__header">
                <div>
                    <h2 class="relato-card__title">${post.titulo}</h2>
                    <h5 class="relato-card__author">${post.anonimo ? 'Anônimo' : 'Usuária'}</h5>
                </div>
                <button class="relato-card__report">
                    <i class="fa-solid fa-circle-exclamation"></i>
                </button>
            </div>

            <p class="relato-card__text">${post.conteudo}</p>

            <div class="relato-card__actions">
                <button class="relato-card__vote relato-card__vote--up ${tipoMeuVoto === 'upvote' ? 'relato-card__vote--ativo' : ''}" onclick="gerenciarVoto('${post.id}', 'upvote')">
                    <i class="fa-solid fa-chevron-up"></i>
                </button>

                <span class="relato-card__votes">${totalVotos}</span>

                <button class="relato-card__vote relato-card__vote--down ${tipoMeuVoto === 'downvote' ? 'relato-card__vote--ativo' : ''}" onclick="gerenciarVoto('${post.id}', 'downvote')">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função para gerenciar votos
async function gerenciarVoto(postId, tipo) {
    if (!usuario) {
        alert('Você precisa estar logado para votar');
        return;
    }

    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    const votosExistentes = avaliacoes.filter(v => 
        v.postagemId.toString() === postId.toString() && 
        v.usuarioId.toString() === usuario.id.toString()
    );

    if (votosExistentes.length > 0) {
        const votoAtual = votosExistentes[0];

        if (votoAtual.tipoVoto === tipo) {
            // Remove o voto se clicou no mesmo tipo
            const novasAvaliacoes = avaliacoes.filter(v => v.id !== votoAtual.id);
            localStorage.setItem('avaliacoes', JSON.stringify(novasAvaliacoes));
        } else {
            // Muda o tipo de voto
            votoAtual.tipoVoto = tipo;
            localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
        }

        // Remove votos duplicados
        if (votosExistentes.length > 1) {
            const idsParaRemover = votosExistentes.slice(1).map(v => v.id);
            const novasAvaliacoes = avaliacoes.filter(v => !idsParaRemover.includes(v.id));
            localStorage.setItem('avaliacoes', JSON.stringify(novasAvaliacoes));
        }
    } else {
        // Cria novo voto
        const proximoId = avaliacoes.length > 0 ? Math.max(...avaliacoes.map(v => v.id)) + 1 : 1;
        
        const novoVoto = {
            id: proximoId,
            postagemId: postId.toString(),
            usuarioId: usuario.id,
            tipoVoto: tipo,
            dataCriacao: new Date().toISOString().split('T')[0]
        };
        
        avaliacoes.push(novoVoto);
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
    }

    carregarDados();
}

// Função para criar postagem
async function criarPostagem(conteudo) {
    if (!usuario) {
        alert('Você precisa estar logado para criar uma postagem');
        return;
    }

    const texto = conteudo.trim();
    if (!texto) {
        alert('Digite uma postagem');
        return;
    }

    const postagens = JSON.parse(localStorage.getItem('postagens')) || [];
    const proximoId = postagens.length > 0 ? Math.max(...postagens.map(p => p.id)) + 1 : 1;

    const titulo = texto.length > 50 ? `${texto.slice(0, 47)}...` : texto;

    const novaPostagem = {
        id: proximoId,
        titulo,
        conteudo: texto,
        usuarioId: usuario.id,
        comunidadeId: 1,
        anonimo: true,
        status: 'aprovado',
        dataCriacao: new Date().toISOString().split('T')[0]
    };

    postagens.push(novaPostagem);
    localStorage.setItem('postagens', JSON.stringify(postagens));
    
    carregarDados();
}

// Função para configurar eventos de votação
function configurarEventosVotacao() {
    // Eventos são adicionados inline nos botões de votação
}

// Função para configurar eventos de denúncia
function configurarEventosDenuncia() {
    const denunciarBtns = document.querySelectorAll(".relato-card__report");
    denunciarBtns.forEach((botao) => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();
            const relatoCard = botao.closest(".relato-card");
            postagemSelecionada = Number(relatoCard.dataset.id);
            abrirModalDenuncia();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // Carregamento do Botão de Painel do Admin
    if (usuario?.nivel == "admin") {
        document.getElementById("adminMenu").style.display = "block";
    }

    // Dropdown do Painel do Admin

    const painelBtn = document.getElementById("Painel__adm");
    const dropdown = document.getElementById("adminDropdown");

    painelBtn?.addEventListener("click", () => {

        dropdown.classList.toggle("ativo");

    });

    document.getElementById("btnUsuarios")
        .addEventListener("click", () => {
            window.location.href = "controle_usuarios.html";
        });

    document.getElementById("btnDenuncias")
        .addEventListener("click", () => {
            window.location.href = "controle_denuncias.html";
        });

    document.getElementById("btnDoacoes")
        .addEventListener("click", () => {
            window.location.href = "doacoes.html";
        });

        
    document.getElementById("btnMural")
        .addEventListener("click", () => {
            window.location.href = "mural.html";
        });
    
    document.getElementById("btn-comunidades")
        .addEventListener("click", () => {
            window.location.href = "comunidades.html";
        });
        
    // LOGOUT
    const logoutBtn = document.getElementById("Logout");
    logoutBtn.addEventListener("click", () => {
        logout();
    });

    // Abrir modal de denúncia
    const denunciarBtns = document.querySelectorAll(".relato-card__report");
    denunciarBtns.forEach((botao) => {
        botao.addEventListener("click", () => {
            const relatoCard = botao.closest(".relato-card");
            postagemSelecionada = Number(relatoCard.dataset.id);
            abrirModalDenuncia();
        });
    });

    // Enviar denúncia
    const enviarDenunciaBtn = document.querySelector(".report-modal__button");
    enviarDenunciaBtn.addEventListener("click", () => {
        criarDenuncia();
    });

    // FECHAR MODAL
    const fecharDenunciaBtn = document.querySelector(".report-modal__close");
    fecharDenunciaBtn.addEventListener("click", () => {
        fecharModalDenuncia();
    });

    // Formulário de postagem
    const formPostagem = document.getElementById('formRelato');
    const inputPostagem = document.querySelector('.mural-post__input');

    if (formPostagem) {
        formPostagem.addEventListener('submit', async (e) => {
            e.preventDefault();
            await criarPostagem(inputPostagem.value);
            inputPostagem.value = '';
        });
    }
});

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

function abrirModalDenuncia() {
    const modal = document.getElementById("reportModal");
    modal.style.display = "flex";
}

function fecharModalDenuncia() {
    const modal = document.getElementById("reportModal");
    modal.style.display = "none";
}


// Função para criar denúncia
function criarDenuncia() {
    if (!usuario) {
        alert('Você precisa estar logado para criar uma denúncia');
        return;
    }

    // pega textarea do modal

    const textarea = document.querySelector(".report-modal__textarea");

    // pega motivo digitado
    const motivo = textarea.value;

    // valida campo vazio
    if (!motivo.trim()) {
        window.alert("Digite o motivo da denúncia");
        return;
    }

    // pega denúncias existentes
    const denuncias = JSON.parse(
        localStorage.getItem("denuncias")
    ) || [];

    // gera ID automático
    const ultimoId =
        denuncias.length > 0
            ? denuncias[denuncias.length - 1].id
            : 0;

    // cria denúncia
    const novaDenuncia = {
        id: ultimoId + 1,
        postagemId: postagemSelecionada,
        usuarioId: usuario.id,
        descricao: motivo,
        dataCriacao: new Date().toISOString(),
        status: "pendente"
    };

    // adiciona no array
    denuncias.push(novaDenuncia);

    // salva no localStorage
    localStorage.setItem(
        "denuncias",
        JSON.stringify(denuncias)
    );

    // limpa textarea
    textarea.value = "";

    fecharModalDenuncia();

    window.alert("Denúncia criada");

}