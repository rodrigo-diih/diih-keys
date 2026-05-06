
async function carregarProdutos() {

  const areaProdutos =
  document.querySelector("[data-produtos]");

  if (!areaProdutos) return;

  const categoriaAtual =
  document.body.dataset.categoria;

  try {

    const resposta =
    await fetch("produtos.json");

    const produtos =
    await resposta.json();

    const filtrados =
    produtos.filter(produto =>
      produto.categoria === categoriaAtual
    );

    areaProdutos.innerHTML = "";

    filtrados.forEach(produto => {

      const tagsHTML =
      produto.tags.map(tag =>
        `<span class="tag">${tag}</span>`
      ).join("");

      const card = document.createElement("div");

      card.classList.add("pack-card");

      card.innerHTML = `

        <img
          src="${produto.imagem}"
          class="pack-image"
          alt="${produto.nome}"
        >

        <div class="tags">
          ${tagsHTML}
        </div>

        <h3>${produto.nome}</h3>

        <p>${produto.descricao}</p>

        <audio controls class="audio-player">
          <source
            src="${produto.audio}"
            type="audio/mpeg"
          >
        </audio>

        <strong class="preco">
          ${produto.preco}
        </strong>

        <a
          href="${produto.link}"
          class="pack-btn"
        >
          Comprar Pack
        </a>

      `;

      areaProdutos.appendChild(card);

    });

  } catch (erro) {

    console.error(
      "Erro ao carregar produtos:",
      erro
    );

  }

}

carregarProdutos();
