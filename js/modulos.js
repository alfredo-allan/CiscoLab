class CyberSecGlobalSearch {
  constructor() {
    // Lista de todos os módulos/páginas para buscar
    this.pages = [
      { path: '/index.html', name: 'Módulo 1', title: 'Introdução às Redes' },
      { path: '/pages/modulo_2.html', name: 'Módulo 2', title: 'Protegendo Redes' },
      { path: '/pages/modulo_3.html', name: 'Módulo 3', title: 'Protocolos e Vulnerabilidades' },
      { path: '/pages/modulo_4.html', name: 'Módulo 4', title: 'Serviços e Mitigação' },
      { path: '/pages/modulo_5.html', name: 'Módulo 5', title: 'Comunicação de Rede Sem Fio' },
      { path: '/pages/modulo_6.html', name: 'Módulo 6', title: 'Infraestrutura de Segurança' },
      { path: '/pages/modulo_7.html', name: 'Módulo 7', title: 'Sistema Operacional Windows' }

    ]

    this.searchTimeout = null
    this.init()
  }

  init() {
    const searchInput = document.getElementById('cybersecGlobalSearch')
    const resultsDiv = document.getElementById('cybersecSearchResults')
    const statsSpan = document.getElementById('searchStatsResults')
    const statusSpan = document.getElementById('searchStatus')
    const modulesCount = document.getElementById('searchModulesCount')

    modulesCount.textContent = this.pages.length + ' módulos'

    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout)
      const term = e.target.value.trim()

      if (term.length < 2) {
        resultsDiv.innerHTML = ''
        statsSpan.textContent = '0'
        statusSpan.innerHTML = '<i class="fas fa-check-circle"></i> aguardando...'
        return
      }

      // Loading state
      resultsDiv.innerHTML = '<div class="cybersec-loading"><i class="fas fa-spinner fa-spin"></i> varrendo todos os módulos...</div>'
      statusSpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> buscando...'

      this.searchTimeout = setTimeout(() => {
        this.performSearch(term)
      }, 500)
    })

    // Enter para buscar imediatamente
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(this.searchTimeout)
        const term = e.target.value.trim()
        if (term.length >= 2) {
          this.performSearch(term)
        }
      }
    })
  }

  async performSearch(term) {
    const resultsDiv = document.getElementById('cybersecSearchResults')
    const statsSpan = document.getElementById('searchStatsResults')
    const statusSpan = document.getElementById('searchStatus')

    const searchTerm = term.toLowerCase()
    let allResults = []
    let modulesSearched = 0

    // Para cada página, fazer fetch e buscar
    for (const page of this.pages) {
      try {
        const response = await fetch(page.path)
        const html = await response.text()

        // Criar um DOM parser para extrair o conteúdo
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        // Buscar em elementos de conteúdo (remover navbar, footer, scripts)
        const contentElements = doc.querySelectorAll(
          'section, .content-card, p, h1, h2, h3, h4, h5, h6, li, .cisco-title, .section-tag, .badge-cisco'
        )

        contentElements.forEach((element) => {
          const text = element.textContent.trim()
          if (text.toLowerCase().includes(searchTerm)) {
            // Extrair o contexto (trecho ao redor do termo)
            const index = text.toLowerCase().indexOf(searchTerm)
            const start = Math.max(0, index - 40)
            const end = Math.min(text.length, index + searchTerm.length + 40)
            let snippet = text.substring(start, end)

            // Se o snippet não começar no início, adicionar "..."
            if (start > 0) snippet = '...' + snippet
            if (end < text.length) snippet = snippet + '...'

            // Destacar o termo no snippet
            const regex = new RegExp(`(${searchTerm})`, 'gi')
            snippet = snippet.replace(regex, '<mark>$1</mark>')

            // Tentar encontrar um ID para âncora
            let anchorId = element.id || element.closest('[id]')?.id || element.querySelector('[id]')?.id

            // Se não encontrar ID, criar um baseado no texto
            if (!anchorId) {
              anchorId =
                'section-' +
                text
                  .substring(0, 30)
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, '-')
            }

            // Título do resultado (primeira linha ou elemento pai)
            let resultTitle = element.tagName + ' - ' + text.substring(0, 60)
            if (element.closest('h2') || element.closest('h3')) {
              resultTitle = element.closest('h2')?.textContent || element.closest('h3')?.textContent || resultTitle
            }

            allResults.push({
              moduleName: page.name,
              moduleTitle: page.title,
              path: page.path + (anchorId ? '#' + anchorId : ''),
              title: resultTitle.substring(0, 80),
              snippet: snippet,
              context: text
            })
          }
        })

        modulesSearched++
        statusSpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> buscando... (${modulesSearched}/${this.pages.length})`
      } catch (error) {
        console.warn(`Erro ao buscar ${page.path}:`, error)
      }
    }

    // Ordenar resultados por relevância (simples: módulos mais próximos do início)
    allResults.sort((a, b) => a.moduleName.localeCompare(b.moduleName))

    // Atualizar UI
    statsSpan.textContent = allResults.length
    statusSpan.innerHTML = '<i class="fas fa-check-circle"></i> concluído'

    if (allResults.length === 0) {
      resultsDiv.innerHTML = `
                <div class="cybersec-no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum resultado encontrado para "<strong>${term}</strong>"</p>
                    <p style="font-size: 0.8rem; color: #444">tente outros termos: firewall, vpn, dmz, windows, etc</p>
                </div>
            `
      return
    }

    // Renderizar resultados
    let html = ''
    allResults.forEach((result) => {
      html += `
                <div class="cybersec-result-item" onclick="window.location.href='${result.path}'">
                    <div>
                        <span class="cybersec-result-module">${result.moduleName}</span>
                        <span style="color: #666; font-size: 0.7rem">${result.moduleTitle}</span>
                    </div>
                    <div class="cybersec-result-title">${result.title}</div>
                    <div class="cybersec-result-snippet">${result.snippet}</div>
                    <div class="cybersec-result-meta">
                        <span><i class="fas fa-link"></i> ${result.path}</span>
                    </div>
                </div>
            `
    })

    resultsDiv.innerHTML = html
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  new CyberSecGlobalSearch()
})
