const STORAGE_KEY = 'rede_elas_comunidades';
const STORAGE_KEY_POSTS = 'rede_elas_comunidades_posts';

const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postList = document.getElementById('postList');
const communityInfo = document.getElementById('communityInfo');
const postsCount = document.getElementById('postsCount');
const pageSubtitle = document.getElementById('pageSubtitle');
const toast = document.getElementById('toast');

const params = new URLSearchParams(window.location.search);
const comunidadeId = Number(params.get('comunidadeId')) || null;

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

const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

function lerComunidadesStorage() {
  const dados = localStorage.getItem(STORAGE_KEY);
  if (!dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(COMUNIDADES_SEED));
    return [...COMUNIDADES_SEED];
  }

  try {
    return JSON.parse(dados);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(COMUNIDADES_SEED));
    return [...COMUNIDADES_SEED];
  }
}

function lerPostsStorage() {
  const dados = localStorage.getItem(STORAGE_KEY_POSTS);
  if (!dados) return [];

  try {
    return JSON.parse(dados);
  } catch {
    localStorage.removeItem(STORAGE_KEY_POSTS);
    return [];
  }
}

function salvarPostsStorage(posts) {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
}

function obterComunidadePorId(id) {
  const comunidades = lerComunidadesStorage();
  return comunidades.find((comunidade) => comunidade.id === id) || null;
}

function atualizarLista() {
  const posts = lerPostsStorage().filter((post) => post.comunidadeId === comunidadeId);
  const total = posts.length;

  postsCount.textContent = `${total} postagem${total !== 1 ? 's' : ''}`;

  if (posts.length === 0) {
    postList.innerHTML = '<p class="post-empty">Nenhuma postagem ainda.</p>';
    return;
  }

  postList.innerHTML = posts
    .map(
      (post) => `
      <div class="post-item">
        <span class="post-date">${escapeHTML(post.data)}</span>
        <p class="post-text">${escapeHTML(post.texto)}</p>
      </div>
    `
    )
    .join('');
}

function mostrarToast(mensagem) {
  if (!toast) return;

  toast.textContent = mensagem;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function init() {
  const comunidade = comunidadeId ? obterComunidadePorId(comunidadeId) : null;

  if (!comunidade) {
    communityInfo.textContent = 'Comunidade não encontrada.';
    pageSubtitle.textContent = 'Volte para Comunidades e escolha uma comunidade primeiro.';
    postForm.classList.add('hidden');
    postList.innerHTML = '<p class="post-empty">Selecione uma comunidade em Comunidades para ver e criar postagens.</p>';
    return;
  }

  communityInfo.textContent = `Comunidade: ${comunidade.nome}`;
  pageSubtitle.textContent = `Postagens de ${comunidade.nome}`;
  atualizarLista();
}

document.addEventListener('DOMContentLoaded', () => {
  // Botão voltar
  const btnVoltar = document.getElementById('btnVoltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      window.location.href = 'comunidades.html';
    });
  }

  // Botão comunidades no header
  const btnComunidades = document.getElementById('btn-comunidades');
  if (btnComunidades) {
    btnComunidades.addEventListener('click', () => {
      window.location.href = 'comunidades.html';
    });
  }

  // Logout
  const logoutBtn = document.getElementById('Logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    });
  }

  // Formulário de postagem
  if (postForm) {
    postForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!comunidadeId) return;

      const texto = postText.value.trim();
      if (!texto) {
        mostrarToast('Digite uma postagem');
        return;
      }

      const posts = lerPostsStorage();
      posts.push({
        id: Date.now(),
        comunidadeId,
        texto,
        data: new Date().toLocaleDateString('pt-BR')
      });

      salvarPostsStorage(posts);
      postText.value = '';
      atualizarLista();
      mostrarToast('Postagem adicionada!');
    });
  }

  init();
});
