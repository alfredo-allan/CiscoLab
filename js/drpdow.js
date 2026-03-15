function toggleModulo(elemento) {
  // Só funciona no mobile
  if (window.innerWidth <= 991) {
    const coluna = elemento.closest('.modulo-coluna')
    coluna.classList.toggle('expandido')
  }
}

// Busca no mega menu
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('megaMenuSearch')
  if (searchInput) {
    searchInput.addEventListener('keyup', function () {
      const termo = this.value.toLowerCase()
      const links = document.querySelectorAll('.modulo-lista a')

      links.forEach((link) => {
        const texto = link.textContent.toLowerCase()
        const item = link.closest('li')

        if (texto.includes(termo)) {
          item.style.display = 'block'
          // Expande automaticamente a coluna no mobile
          if (window.innerWidth <= 991) {
            link.closest('.modulo-coluna').classList.add('expandido')
          }
        } else {
          item.style.display = 'none'
        }
      })

      // Se o termo estiver vazio, reseta tudo
      if (termo === '') {
        links.forEach((link) => {
          link.closest('li').style.display = 'block'
        })
      }
    })
  }
})
