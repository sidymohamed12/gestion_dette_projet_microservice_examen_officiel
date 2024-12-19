document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/api/clients";
  const clientsListElement = document.getElementById("liste-clients");
  // const searchInput = document.getElementById("search");
  const paginationElement = document.getElementById("pagination");
  let currentPage = 1;

  async function loadclients(page) {
    try {
      history.pushState(null, "", `?page=${page}`);

      const response = await fetch(`${apiUrl}?page=${page}`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();
      const clients = result.data;
      const totalPages = result.totalPages;
      displayclients(clients);
      displayPagination(totalPages, page);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
    }
  }

  function displayclients(clients) {
    clientsListElement.innerHTML = "";

    clients.forEach((cl) => {
      const row = document.createElement("tr");
      row.className = "bg-white border-b hover:bg-blue-200";

      row.innerHTML = `
        <td class="px-6 py-4">
            ${
              cl.prenom != null
                ? `
            <div class="flex items-center justify-center">
                <div class=" h-10 w-10 flex-shrink-0">
                    <img class="h-full w-full rounded-full" src="/image/Users/${cl.image}" alt="" />
                </div>
                <div class="ml-3 font-semibold">
                    <p class="whitespace-no-wrap">
                        ${cl.prenom} - ${cl.nom}
                    </p>
                </div>
            </div>`
                : ""
            }
            
        </td>
        <td class="px-6 py-4">${cl.surnom}</td>
        <td class="px-6 py-4">${cl.telephone}</td>
        <td class="px-6 py-4">${cl.adresse}</td>
        <td class="px-6 py-4">
          <a href="/clients/id=${
            cl.id
          }" class="font-medium text-green-500 hover:underline">Voir détail</a>
        </td>
      `;

      clientsListElement.appendChild(row);
    });
  }

  function displayPagination(totalPages, currentPage) {
    paginationElement.innerHTML = "";

    // Ajouter le bouton "Précédent"
    const prevButton = document.createElement("li");
    if (currentPage > 1) {
      prevButton.innerHTML = `
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
          <span class="sr-only">Previous</span>
          <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
          </svg>
        </a>
      `;
      prevButton.querySelector("a").onclick = () =>
        loadclients(currentPage - 1);
    } else {
      prevButton.innerHTML = `
        <span class="flex items-center justify-center px-3 h-8 leading-tight text-gray-300 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed">
          <span class="sr-only">Previous</span>
          <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
          </svg>
        </span>
      `;
    }
    paginationElement.appendChild(prevButton);

    // Ajouter les boutons de pages
    for (let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement("li");
      const isActive =
        page === currentPage
          ? "bg-gradient-to-br from-green-400 to-blue-600 text-white"
          : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700";

      pageButton.innerHTML = `
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight border ${isActive}">
          ${page}
        </a>
      `;

      pageButton.querySelector("a").onclick = () => loadclients(page);
      paginationElement.appendChild(pageButton);
    }

    const nextButton = document.createElement("li");
    if (currentPage < totalPages) {
      nextButton.innerHTML = `
        <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
          <span class="sr-only">Next</span>
          <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
          </svg>
        </a>
      `;
      nextButton.querySelector("a").onclick = () =>
        loadclients(currentPage + 1);
    } else {
      nextButton.innerHTML = `
        <span class="flex items-center justify-center px-3 h-8 leading-tight text-gray-300 bg-white border border-gray-300 rounded-e-lg cursor-not-allowed">
          <span class="sr-only">Next</span>
          <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
          </svg>
        </span>
      `;
    }
    paginationElement.appendChild(nextButton);
  }

  // Charger les clients au chargement de la page
  loadclients(currentPage);
});
