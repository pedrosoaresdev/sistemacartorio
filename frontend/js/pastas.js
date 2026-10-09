const body = document.getElementById("folderBody");
const searchEl = document.getElementById("search");
const statusEl = document.getElementById("statusFilter");
const modal = document.getElementById("modal");
const formError = document.getElementById("formError");

const params = new URLSearchParams(location.search);
searchEl.value = params.get("q") || "";

async function loadFolders() {
  const qs = new URLSearchParams();
  if (searchEl.value.trim()) qs.set("q", searchEl.value.trim());
  if (statusEl.value) qs.set("status", statusEl.value);

  const res = await api("/api/folders?" + qs.toString());
  if (!res || !res.ok) {
    body.innerHTML = `<tr><td colspan="5">Erro ao carregar as pastas.</td></tr>`;
    return;
  }
  const list = await res.json();

  body.innerHTML = list.length
    ? list.map((f) => `
        <tr>
          <td><code>${escapeHtml(f.protocol)}</code></td>
          <td>${escapeHtml(f.personName)}</td>
          <td>${escapeHtml(f.category)}</td>
          <td><span class="badge">${escapeHtml(f.status)}</span></td>
          <td>${new Date(f.createdAt).toLocaleDateString("pt-BR")}</td>
        </tr>`).join("")
    : `<tr><td colspan="5">Nenhuma pasta encontrada.</td></tr>`;
}

let timer;
searchEl.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(loadFolders, 300); // espera parar de digitar
});
statusEl.addEventListener("change", loadFolders);

function openModal() { formError.textContent = ""; modal.hidden = false; document.getElementById("fName").focus(); }
function closeModal() { modal.hidden = true; document.getElementById("folderForm").reset(); }

document.getElementById("btnNew").addEventListener("click", openModal);
document.getElementById("btnCancel").addEventListener("click", closeModal);
if (params.get("novo")) openModal();

document.getElementById("folderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = "";

  const res = await api("/api/folders", {
    method: "POST",
    body: JSON.stringify({
      personName: document.getElementById("fName").value,
      cpf: document.getElementById("fCpf").value,
      category: document.getElementById("fCategory").value,
      description: document.getElementById("fDesc").value,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    formError.textContent = data.message || "Não foi possível criar a pasta.";
    return;
  }
  closeModal();
  loadFolders();
});

loadFolders();