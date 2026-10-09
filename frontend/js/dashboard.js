(async () => {
  const res = await api("/api/dashboard");
  if (!res || !res.ok) return;
  const d = await res.json();

  document.getElementById("cFolders").textContent = d.totalFolders;
  document.getElementById("cActive").textContent = d.activeFolders;
  document.getElementById("cDocs").textContent = d.totalDocuments;

  if (d.activeUsers !== null) {
    document.getElementById("cardUsers").hidden = false;
    document.getElementById("cUsers").textContent = d.activeUsers;
  }

  const body = document.getElementById("recentBody");
  body.innerHTML = d.recentFolders.length
    ? d.recentFolders.map((f) => `
        <tr>
          <td><code>${escapeHtml(f.protocol)}</code></td>
          <td>${escapeHtml(f.personName)}</td>
          <td><span class="badge">${escapeHtml(f.status)}</span></td>
          <td>${new Date(f.createdAt).toLocaleDateString("pt-BR")}</td>
        </tr>`).join("")
    : `<tr><td colspan="4">Nenhuma pasta criada ainda.</td></tr>`;
})();