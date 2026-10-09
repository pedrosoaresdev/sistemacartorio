const API_URL = "http://localhost:5253";

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

async function api(path, options = {}) {
  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: "Bearer " + getToken() }),
      ...options.headers,
    },
  });

  // Token expirado ou inválido: volta para o login
  if (res.status === 401 && !path.includes("/auth/login")) {
    logout();
    return;
  }
  return res;
}