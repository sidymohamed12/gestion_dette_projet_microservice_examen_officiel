document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/id=(\d+)/);
  const id = match ? match[1] : null;
  const apiUrl = "/api/clients/id=" + id;
  const detteClientsListElement = document.getElementById("liste-dette-client");
  const surnom = document.getElementById("surnom");
  const telephone = document.getElementById("telephone");
  //   const adresse = document.getElementById("adresse");
  const total = document.getElementById("total");
  //   const image = document.getElementById("image");
  const totalVerser = document.getElementById("totalVerser");
  const totalRestant = document.getElementById("totalRestant");

  const loadDetails = async () => {
    try {
      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const detail = await response.json();
      surnom.innerHTML += " " + detail.surnom;
      telephone.innerHTML += " " + detail.telephone;
      //   adresse.innerHTML += " " + detail.adresse;
      //   image.src = "/image/Users/" + detail.image;

      displaydetails(detail.dettes);
      calculTotal(detail.dettes);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des details du client :",
        error
      );
    }
  };

  const calculTotal = (detail) => {
    let montanttotal = 0;
    let montanttotalVerser = 0;
    let montanttotalRestant = 0;
    detail.forEach((dette) => {
      montanttotal += parseFloat(dette.montant);
      montanttotalVerser += parseFloat(dette.montantVerser);
      montanttotalRestant += parseFloat(montanttotal - montanttotalVerser);
    });
    total.innerHTML += " " + montanttotal + " Fcfa";
    totalVerser.innerHTML += " " + montanttotalVerser + " Fcfa";
    totalRestant.innerHTML += " " + montanttotalRestant + " Fcfa";
  };

  const displaydetails = (detail) => {
    detteClientsListElement.innerHTML = "";
    detail.forEach((dette) => {
      const row = document.createElement("tr");
      row.className = "bg-white border-b hover:bg-blue-200";

      row.innerHTML = `
        <td class="px-6 py-4" >${dette.date}</td>
        <td class="px-6 py-4" >${dette.montant}</td>
        <td class="px-6 py-4" >${dette.montantVerser}</td>
        <td class="px-6 py-4" >${dette.montant - dette.montantVerser}</td>
        <td class="px-6 py-4">
          <a href="/dettes/id=${
            dette.id
          }" class="font-medium text-green-500 hover:underline">Voir détail</a>
        </td>
      `;

      detteClientsListElement.appendChild(row);
    });
  };

  loadDetails();
});
