// Efeito de entrada moderno
anime({
  targets: ".reveal",
  translateY: [30, 0],
  opacity: [0, 1],
  delay: anime.stagger(200),
  duration: 1000,
  easing: "easeOutExpo",
});

/* Navbar */
document.addEventListener("DOMContentLoaded", function () {
  // 1. Busca no dropdown
  const searchInput = document.getElementById("navSearch");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const filter = this.value.toLowerCase();
      const items = document.querySelectorAll("#sectionList .dropdown-item");

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? "block" : "none";
      });
    });
  }

  // 2. Barra de progresso da leitura
  window.addEventListener("scroll", function () {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const progressBar = document.getElementById("readingProgress");
    if (progressBar) progressBar.style.width = scrolled + "%";
  });

  // 3. Fechar dropdown ao clicar no item (mobile)
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      const navbarCollapse = document.getElementById("navbarNav");
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    });
  });

  // 4. Smooth scroll com offset para o navbar fixo
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = 100; // altura do navbar + barra de progresso
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
