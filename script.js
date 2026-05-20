// ─── CARREGAR PRODUTOS DO JSON ───────────────────────────────────────────────

async function carregarProdutos() {
  try {
    const resposta = await fetch('produtos.json');
    const produtos = await resposta.json();
    return produtos;
  } catch (e) {
    console.error('Erro ao carregar produtos.json:', e);
    return [];
  }
}

// ─── GERAR HTML DO CARD ──────────────────────────────────────────────────────

function criarCardProduto(produto) {
  const tags = (produto.tags || [])
    .map(t => '<span class="tag">' + t + '</span>')
    .join('');

  const audio = produto.audio
    ? '<audio class="audio-player" controls src="' + produto.audio + '"></audio>'
    : '';

  const preco = produto.preco
    ? '<span class="preco">' + produto.preco + '</span>'
    : '';

  const link = produto.link && produto.link !== '#'
    ? produto.link
    : '#';

  const imagem = produto.imagem
    ? '<img class="pack-image" src="' + produto.imagem + '" alt="' + produto.nome + '" onerror="this.style.display=\'none\'"/>'
    : '';

  return '<div class="pack-card">' +
    imagem +
    '<div class="tags">' + tags + '</div>' +
    '<h3>' + produto.nome + '</h3>' +
    '<p>' + (produto.descricao || '') + '</p>' +
    audio +
    preco +
    '<a href="' + link + '" class="pack-btn"' + (link === '#' ? '' : ' target="_blank"') + '>Comprar Pack</a>' +
  '</div>';
}

// ─── INDEX: RENDERIZAR DESTAQUES ─────────────────────────────────────────────

async function renderizarDestaques() {
  const grid = document.getElementById('packsGrid');
  if (!grid) return;

  const produtos = await carregarProdutos();

  const destaques = produtos
    .filter(p => p.ativo !== false && p.destaque === true)
    .slice(0, 6);

  if (!destaques.length) {
    grid.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1">Nenhum produto em destaque no momento.</p>';
    return;
  }

  grid.innerHTML = destaques.map(criarCardProduto).join('');
}

// ─── PÁGINA DE CATEGORIA: RENDERIZAR PRODUTOS ────────────────────────────────

async function renderizarCategoria(categoria) {
  const grid = document.getElementById('packsGrid');
  if (!grid) return;

  const produtos = await carregarProdutos();

  const filtrados = produtos.filter(p =>
    p.ativo !== false &&
    p.categoria.toLowerCase() === categoria.toLowerCase()
  );

  if (!filtrados.length) {
    grid.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1">Nenhum produto disponível nesta categoria ainda.</p>';
    return;
  }

  grid.innerHTML = filtrados.map(criarCardProduto).join('');
}

// ─── INICIALIZAR ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // Detecta se é o index (destaques) ou uma página de categoria
  const pagina = document.body.getAttribute('data-pagina');

  if (!pagina || pagina === 'index') {
    renderizarDestaques();
  } else {
    renderizarCategoria(pagina);
  }

  // Carrossel da página sobre (mantido do original)
  var slideAtual = 0;
  var slides = document.querySelectorAll('.carousel-image');

  if (slides.length) {
    function mostrarSlide(index) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      slides[index].classList.add('active');
    }

    window.avancarSlide = function () {
      slideAtual = (slideAtual + 1) % slides.length;
      mostrarSlide(slideAtual);
    };

    window.voltarSlide = function () {
      slideAtual = (slideAtual - 1 + slides.length) % slides.length;
      mostrarSlide(slideAtual);
    };

    setInterval(window.avancarSlide, 3000);
  }

});
