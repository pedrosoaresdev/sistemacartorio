// Se já estiver logado, vai direto para o painel
if (getToken()) window.location.href = "dashboard.html";

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const btn = document.getElementById("submitBtn");
const pwd = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", () => {
  const show = pwd.type === "password";
  pwd.type = show ? "text" : "password";
  toggle.textContent = show ? "Ocultar" : "Mostrar";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = pwd.value;

  if (!username || !password) {
    errorEl.textContent = "Preencha usuário e senha.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Entrando...";

  try {
    const res = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      errorEl.textContent = data.message || "Não foi possível entrar.";
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    window.location.href = "dashboard.html";
  } catch {
    errorEl.textContent = "Servidor indisponível. Verifique se a API está rodando.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});