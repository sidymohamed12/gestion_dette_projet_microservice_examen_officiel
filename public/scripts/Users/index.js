document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/api/users";
  const usersListElement = document.getElementById("liste-users");

  const loadUsers = async () => {
    try {
      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const users = await response.json();
      displayUsers(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des users :", error);
    }
  };

  const displayUsers = (users) => {
    usersListElement.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.className = "bg-white border-b hover:bg-blue-200";

      row.innerHTML = `
        <td class="px-6 py-4">${user.prenom}</td>
        <td class="px-6 py-4">${user.nom}</td>
        <td class="px-6 py-4">${user.login}</td>
        <td class="px-6 py-4">${user.role}</td>
        <td class="px-6 py-4">
          <a href="#" class="font-medium text-green-500 hover:underline">Voir détail</a>
        </td>
      `;

      usersListElement.appendChild(row);
    });
  };

  // Charger les users au chargement de la page
  loadUsers();
});
