const STORAGE_KEY = 'rede_elas_comunidades';

const COMUNIDADES_SEED = [
  {
    id: 1,
    nome: 'Rede de Apoio',
    descricao: 'Espaço seguro para compartilhar experiências e buscar apoio emocional',
    data_criacao: '2026-04-17',
    total_membros: 113,
    categoria: 'Apoio Emocional',
    imagem: '💜'
  },
  {
    id: 2,
    nome: 'Conscientização',
    descricao: 'Espaço de informação e conscientização sobre os direitos das mulheres',
    data_criacao: '2026-02-28',
    total_membros: 204,
    categoria: 'Educativo',
    imagem: '📚'
  },
  {
    id: 3,
    nome: 'Saúde Mental Feminina',
    descricao: 'Grupo de apoio focado em saúde mental, bem-estar emocional e autocuidado para mulheres em situação de vulnerabilidade.',
    data_criacao: '2026-01-15',
    total_membros: 156,
    categoria: 'Saúde',
    imagem: '🌸'
  },
  {
    id: 4,
    nome: 'Recomeço e Superação',
    descricao: 'Para mulheres que buscam reconstruir suas vidas após situações de violência ou abuso',
    data_criacao: '2026-03-22',
    total_membros: 98,
    categoria: 'Superação',
    imagem: '🌺'
  }
];

function lerComunidadesStorage() {
  const dados = localStorage.getItem(STORAGE_KEY);

  if (!dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(COMUNIDADES_SEED));
    return [...COMUNIDADES_SEED];
  }

  try {
    return JSON.parse(dados);
  } catch (e) {
    console.error('Storage corrompido, resetando...', e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(COMUNIDADES_SEED));
    return [...COMUNIDADES_SEED];
  }
}

function salvarComunidadesStorage(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

let todasComunidades = [];
let comunidadeAtual = null;

const grid = document.getElementById('comunidadesGrid');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');

const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const filterCategoria = document.getElementById('filterCategoria');
const sortBy = document.getElementById('sortBy');

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalEmoji = document.getElementById('modalEmoji');
const modalCategoria = document.getElementById('modalCategoria');
const modalTitle = document.getElementById('modalTitle');
const modalDescricao = document.getElementById('modalDescricao');
const modalMembros = document.getElementById('modalMembros');
const modalData = document.getElementById('modalData');
const modalMessagesCount = document.getElementById('modalMessagesCount');
const modalPostList = document.getElementById('modalPostList');
const btnEntrar = document.getElementById('btnEntrar');
const btnCriarPost = document.getElementById('btnCriarPost');

const STORAGE_KEY_POSTS = 'rede_elas_comunidades_posts';
const retryBtn = document.getElementById('retryBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const toast = document.getElementById('toast');

// cadastro
const openCadastroModalBtn = document.getElementById('openCadastroModal');
const cadastroModalOverlay = document.getElementById('cadastroModalOverlay');
const cadastroModalClose = document.getElementById('cadastroModalClose');
const cadastroComunidadeForm = document.getElementById('cadastroComunidadeForm');
const nomeComunidade = document.getElementById('nomeComunidade');
const descricaoComunidade = document.getElementById('descricaoComunidade');
const categoriaComunidade = document.getElementById('categoriaComunidade');

document.addEventListener('DOMContentLoaded', () => {
  carregarComunidades();

  if (searchInput && clearSearch) {
    searchInput.addEventListener('input', () => {
      clearSearch.classList.toggle('visible', searchInput.value.length > 0);
      renderizarComunidades();
    });

    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      clearSearch.classList.remove('visible');
      renderizarComunidades();
    });
  }

  if (filterCategoria) filterCategoria.addEventListener('change', renderizarComunidades);
  if (sortBy) sortBy.addEventListener('change', renderizarComunidades);
  if (retryBtn) retryBtn.addEventListener('click', carregarComunidades);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterCategoria) filterCategoria.value = '';
      if (sortBy) sortBy.value = 'nome_asc';
      if (clearSearch) clearSearch.classList.remove('visible');
      renderizarComunidades();
    });
  }

  if (modalClose) modalClose.addEventListener('click', fecharModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) fecharModal();
    });
  }

  if (btnCriarPost) btnCriarPost.addEventListener('click', criarPostagem);

  if (openCadastroModalBtn) {
    openCadastroModalBtn.addEventListener('click', abrirModalCadastro);
  }

  if (cadastroModalClose) {
    cadastroModalClose.addEventListener('click', fecharModalCadastro);
  }

  if (cadastroModalOverlay) {
    cadastroModalOverlay.addEventListener('click', (e) => {
      if (e.target === cadastroModalOverlay) fecharModalCadastro();
    });
  }

  if (cadastroComunidadeForm) {
    cadastroComunidadeForm.addEventListener('submit', cadastrarComunidade);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fecharModal();
      fecharModalCadastro();
    }
  });

  if (btnEntrar) btnEntrar.addEventListener('click', entrarNaComunidade);
});

function carregarComunidades() {
  mostrarEstado('loading');

  try {
    todasComunidades = lerComunidadesStorage();
    mostrarEstado('grid');
    renderizarComunidades();
  } catch (erro) {
    console.error('Erro ao carregar comunidades:', erro);
    mostrarEstado('error');
    if (errorMessage) {
      errorMessage.textContent = 'Não foi possível carregar as comunidades do armazenamento local.';
    }
  }
}

function salvarListaAtual() {
  salvarComunidadesStorage(todasComunidades);
}

function lerPostsStorage() {
  const dados = localStorage.getItem(STORAGE_KEY_POSTS);
  try {
    return dados ? JSON.parse(dados) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY_POSTS);
    return [];
  }
}

function salvarPostsStorage(lista) {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(lista));
}

function obterPostsPorComunidade(idComunidade) {
  return lerPostsStorage().filter((post) => post.comunidadeId === idComunidade);
}

function atualizarMensagensModal(idComunidade) {
  if (!modalMessagesCount || !modalPostList) return;

  const posts = obterPostsPorComunidade(idComunidade);
  modalMessagesCount.textContent = `${posts.length} mensagem${posts.length !== 1 ? 's' : ''}`;

  if (posts.length === 0) {
    modalPostList.innerHTML = '<p class="post-empty">Nenhuma postagem ainda.</p>';
    return;
  }

  modalPostList.innerHTML = posts
    .map(
      (post) => `
      <div class="post-item">
        <span class="post-date">${escapeHTML(formatarData(post.data))}</span>
        <p class="post-text">${escapeHTML(post.texto)}</p>
      </div>
    `
    )
    .join('');
}

function atualizarMembros(id, novoTotal) {
  const idx = todasComunidades.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Comunidade não encontrada');

  todasComunidades[idx].total_membros = novoTotal;
  salvarListaAtual();

  return todasComunidades[idx];
}

function obterProximoId() {
  if (todasComunidades.length === 0) return 1;
  return Math.max(...todasComunidades.map((c) => c.id)) + 1;
}

function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function obterEmojiPorCategoria(categoria) {
  switch (categoria) {
    case 'Apoio Emocional': return '💜';
    case 'Educativo': return '📚';
    case 'Saúde': return '🌸';
    case 'Superação': return '🌺';
    default: return '🤝';
  }
}

function renderizarComunidades() {
  if (!grid) return;

  const termo = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const categoria = filterCategoria ? filterCategoria.value : '';
  const ordem = sortBy ? sortBy.value : '';

  let lista = todasComunidades.filter((c) => {
    if (!termo) return true;

    return (
      c.nome.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo)
    );
  });

  if (categoria) lista = lista.filter((c) => c.categoria === categoria);
  lista = ordenar(lista, ordem);

  if (resultsCount) {
    const total = todasComunidades.length;
    resultsCount.textContent =
      lista.length === total
        ? `${total} comunidade${total !== 1 ? 's' : ''}`
        : `${lista.length} de ${total} comunidades`;
  }

  grid.innerHTML = '';

  if (lista.length === 0) {
    mostrarEstado('empty');
    return;
  }

  mostrarEstado('grid');
  lista.forEach((comunidade, index) => grid.appendChild(criarCard(comunidade, index)));
}

function ordenar(lista, criterio) {
  return [...lista].sort((a, b) => {
    switch (criterio) {
      case 'nome_asc': return a.nome.localeCompare(b.nome, 'pt-BR');
      case 'nome_desc': return b.nome.localeCompare(a.nome, 'pt-BR');
      case 'membros_desc': return b.total_membros - a.total_membros;
      case 'membros_asc': return a.total_membros - b.total_membros;
      case 'data_desc': return new Date(b.data_criacao) - new Date(a.data_criacao);
      case 'data_asc': return new Date(a.data_criacao) - new Date(b.data_criacao);
      default: return 0;
    }
  });
}

function criarCard(comunidade, index) {
  const card = document.createElement('article');
  card.className = 'comunidade-card';
  card.style.animationDelay = `${index * 0.06}s`;

  card.innerHTML = `
    <div class="card-emoji">${comunidade.imagem}</div>
    <span class="card-categoria">${comunidade.categoria}</span>
    <h2 class="card-nome">${escapeHTML(comunidade.nome)}</h2>
    <p class="card-descricao">${escapeHTML(comunidade.descricao)}</p>
    <div class="card-footer">
      <span class="card-membros">${comunidade.total_membros} membros</span>
      <button class="card-btn">Ver comunidade</button>
    </div>
  `;

  card.addEventListener('click', () => abrirModal(comunidade));
  return card;
}

function abrirModal(comunidade) {
  comunidadeAtual = comunidade;
  if (!modalOverlay) return;

  modalEmoji.textContent = comunidade.imagem;
  modalCategoria.textContent = comunidade.categoria;
  modalTitle.textContent = comunidade.nome;
  modalDescricao.textContent = comunidade.descricao;
  modalMembros.textContent = comunidade.total_membros;
  modalData.textContent = formatarData(comunidade.data_criacao);

  if (usuarioJaEntrou(comunidade.id)) {
    btnEntrar.textContent = 'Você já entrou';
    btnEntrar.disabled = true;
  } else {
    btnEntrar.textContent = 'Entrar na Comunidade';
    btnEntrar.disabled = false;
  }

  if (btnCriarPost) {
    btnCriarPost.disabled = false;
    btnCriarPost.textContent = 'Criar postagem';
  }

  atualizarMensagensModal(comunidade.id);
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  comunidadeAtual = null;
}

function criarPostagem() {
  if (!comunidadeAtual) return;
  window.location.href = `./postagens.html?comunidadeId=${comunidadeAtual.id}`;
}

function abrirModalCadastro() {
  if (!cadastroModalOverlay) return;

  if (cadastroComunidadeForm) cadastroComunidadeForm.reset();

  cadastroModalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (nomeComunidade) nomeComunidade.focus();
}

function fecharModalCadastro() {
  if (!cadastroModalOverlay) return;
  cadastroModalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function cadastrarComunidade(event) {
  event.preventDefault();

  const nome = nomeComunidade.value.trim();
  const descricao = descricaoComunidade.value.trim();
  const categoria = categoriaComunidade.value;

  if (!nome || !descricao || !categoria) {
    mostrarToast('Preencha todos os campos para cadastrar');
    return;
  }

  const novaComunidade = {
    id: obterProximoId(),
    nome,
    descricao,
    categoria,
    data_criacao: obterDataAtual(),
    total_membros: 1,
    imagem: obterEmojiPorCategoria(categoria)
  };

  todasComunidades.push(novaComunidade);
  salvarListaAtual();
  renderizarComunidades();
  fecharModalCadastro();
  mostrarToast(`Comunidade "${nome}" cadastrada com sucesso!`);
}

function entrarNaComunidade() {
  if (!comunidadeAtual) return;

  if (usuarioJaEntrou(comunidadeAtual.id)) {
    mostrarToast('Você já faz parte dessa comunidade');
    btnEntrar.textContent = 'Você já entrou';
    btnEntrar.disabled = true;
    return;
  }

  btnEntrar.textContent = 'Entrando...';
  btnEntrar.disabled = true;

  try {
    const novoTotal = comunidadeAtual.total_membros + 1;
    const atualizado = atualizarMembros(comunidadeAtual.id, novoTotal);
    comunidadeAtual.total_membros = atualizado.total_membros;

    registrarEntrada(comunidadeAtual.id);

    renderizarComunidades();
    mostrarToast(`Você entrou em "${comunidadeAtual.nome}"`);
    setTimeout(fecharModal, 1500);
  } catch (erro) {
    console.error('Erro:', erro);
    btnEntrar.textContent = 'Entrar na Comunidade';
    btnEntrar.disabled = false;
    mostrarToast('Erro ao entrar na comunidade');
  }
}

function mostrarEstado(estado) {
  if (!loadingState || !errorState || !emptyState) return;

  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  emptyState.classList.add('hidden');

  if (estado === 'loading') loadingState.classList.remove('hidden');
  if (estado === 'error') errorState.classList.remove('hidden');
  if (estado === 'empty') emptyState.classList.remove('hidden');
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${dia} ${meses[mes - 1]} ${ano}`;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let toastTimer;
function mostrarToast(mensagem) {
  if (!toast) return;

  clearTimeout(toastTimer);
  toast.textContent = mensagem;
  toast.classList.remove('hidden');

  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}


// controle de entrada na cmunidade
const STORAGE_KEY_ENTRADAS = 'rede_elas_comunidades_entradas';

function lerEntradasStorage() {
  const dados = localStorage.getItem(STORAGE_KEY_ENTRADAS);
  try {
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

function salvarEntradasStorage(lista) {
  localStorage.setItem(STORAGE_KEY_ENTRADAS, JSON.stringify(lista));
}

function usuarioJaEntrou(idComunidade) {
  const entradas = lerEntradasStorage();
  return entradas.includes(idComunidade);
}

function registrarEntrada(idComunidade) {
  const entradas = lerEntradasStorage();
  if (!entradas.includes(idComunidade)) {
    entradas.push(idComunidade);
    salvarEntradasStorage(entradas);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("btnDoacoes")
        .addEventListener("click", () => {
            window.location.href = "doacoes.html";
        });

        
    document.getElementById("btnMural")
        .addEventListener("click", () => {
            window.location.href = "mural.html";
        });

    document.getElementById("btn-inicio")
        .addEventListener("click", () => {
          console.log("Passou Aqui");
            window.location.href = "home.html";
        });
});