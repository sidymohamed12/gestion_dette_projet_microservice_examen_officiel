document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/id=(\d+)/);
  const id = match ? match[1] : null;
  const apiUrl = "/api/dettes/id=" + id;
  const surnom = document.getElementById("surnom");
  const telephone = document.getElementById("telephone");
  const total = document.getElementById("total");
  const totalVerser = document.getElementById("totalVerser");
  const totalRestant = document.getElementById("totalRestant");

  const loadDetails = async () => {
    try {
      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      console.log("c bon");
      const detail = await response.json();
      surnom.innerHTML += " " + detail.surnom;
      telephone.innerHTML += " " + detail.telephone;
      total.innerHTML += " " + detail.montant + " Fcfa";
      totalVerser.innerHTML += " " + detail.montantVerser + " Fcfa";
      totalRestant.innerHTML +=
        " " + (detail.montant - detail.montantVerser) + " Fcfa";
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des details du client :",
        error
      );
    }
  };

  loadDetails();
});
