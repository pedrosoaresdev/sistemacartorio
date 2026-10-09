function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

const IS_ADMIN = localStorage.getItem("role") === "Admin";
const ph = (name) => `placeholder.html?p=${encodeURIComponent(name)}`;

const MENU = [
  { section: "Principal" },
  { label: "Dashboard", href: "dashboard.html" },
  { label: "Pastas documentais", href: "pastas.html" },
  { label: "Pessoas cadastradas", href: ph("Pessoas cadastradas") },
  { label: "Documentos", href: ph("Documentos") },
  { label: "Pesquisa avançada", href: ph("Pesquisa avançada") },
  { label: "Histórico de atividades", href: ph("Histórico de atividades") },
  { section: "Gestão", admin: true },
  { label: "Usuários e permissões", href: ph("Usuários e permissões"), admin: true },
  { label: "Segurança e auditoria", href: ph("Segurança e auditoria"), admin: true },
  { label: "Configurações", href: ph("Configurações"), admin: true },
];

function renderShell() {
  const current = location.pathname.split("/").pop() + location.search;

  const items = MENU.filter((m) => !m.admin || IS_ADMIN)
    .map((m) =>
      m.section
        ? `<div class="nav-section">${escapeHtml(m.section)}</div>`
        : `<a class="nav-link ${current === m.href ? "active" : ""}" href="${m.href}">${escapeHtml(m.label)}</a>`
    )
    .join("");

  document.getElementById("sidebar").innerHTML = `
    <div class="sidebar-brand"><span class="logo">C</span> Cartório Digital</div>
    <nav>${items}</nav>
    <button id="sidebarLogout" class="nav-link logout">Sair</button>
  `;

  const name = escapeHtml(localStorage.getItem("name"));
  const role = IS_ADMIN ? "Administrador" : "Usuário";
  document.getElementById("topbar").innerHTML = `
    <form id="quickSearch" class="quick-search">
      <input id="quickSearchInput" type="search" placeholder="Buscar por nome, CPF ou protocolo..." />
    </form>
    <div class="user-box">
      <div class="avatar">${name.charAt(0)}</div>
      <div><strong>${name}</strong><small>${role}</small></div>
    </div>
  `;

  document.getElementById("sidebarLogout").addEventListener("click", logout);
  document.getElementById("quickSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("quickSearchInput").value.trim();
    window.location.href = "pastas.html?q=" + encodeURIComponent(q);
  });
}

renderShell();