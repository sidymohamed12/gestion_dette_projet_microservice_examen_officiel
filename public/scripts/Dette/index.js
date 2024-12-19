document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/api/dettes";
  const detteListElement = document.getElementById("liste-dettes");
  const paginationElement = document.getElementById("pagination");
  const nonSolder = document.getElementById("non-solder");
  const solder = document.getElementById("solder");
  const tout = document.getElementById("tout");
  let currentPage = 1;

  async function loadDettes(page) {
    try {
      history.pushState(null, "", `?page=${page}`);

      const response = await fetch(`${apiUrl}?page=${page}`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();
      const dettes = result.data;
      const totalPages = result.totalPages;
      displayDettes(dettes);
      displayPagination(totalPages, page);
    } catch (error) {
      console.log(
        "Erreur lors de la récupération des données : " + error.message
      );
    }
  }

  function displayDettes(dettes) {
    detteListElement.innerHTML = "";

    dettes.forEach((dette) => {
      const row = document.createElement("tr");
      row.className = "bg-white border-b hover:bg-blue-200";

      row.innerHTML = `
                <td class="px-6 py-4">${dette.date}</td>
                <td class="px-6 py-4">${dette.surnom}</td>
                <td class="px-6 py-4">${dette.montant}</td>
                <td class="px-6 py-4">${dette.montantVerser}</td>
                <td class="px-6 py-4">${
                  dette.montant - dette.montantVerser
                }</td>
                <td class="px-6 py-4">${dette.etat}</td>
                <td class="px-6 py-4">
                    <a href="/dettes/id=${
                      dette.id
                    }" class="font-medium text-green-500 hover:underline">Voir détail</a>
                </td>
            `;
      detteListElement.appendChild(row);
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
      prevButton.querySelector("a").onclick = () => loadDettes(currentPage - 1);
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

      pageButton.querySelector("a").onclick = () => loadDettes(page);
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
      nextButton.querySelector("a").onclick = () => loadDettes(currentPage + 1);
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

  loadDettes(currentPage);
});
