document.addEventListener("DOMContentLoaded", (e) => {
  // Fonction pour charger les clients
  function loadClient() {
    fetch("/api/allClient")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        return response.json();
      })
      .then((clients) => {
        const clientSelect = document.getElementById("client");
        clients.forEach((cl) => {
          const option = document.createElement("option");
          option.value = cl.id;
          option.textContent = cl.surnom;
          clientSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }

  // Fonction pour charger les articles
  function loadArticle() {
    fetch("/api/allArticle")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      })
      .then((articles) => {
        const articleSelect = document.getElementById("article");
        articles.forEach((article) => {
          const option = document.createElement("option");
          option.value = article.id;
          option.textContent = article.libelle;
          articleSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching articles:", error));
  }

  // Fonction pour charger le panier
  function loadPanier() {
    fetch("/api/panier")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch panier");
        }
        return response.json();
      })
      .then((panier) => {
        const listePanier = document.getElementById("table-panier");
        listePanier.innerHTML = ""; // Réinitialiser le contenu de la table
        panier.forEach((item) => {
          const row = document.createElement("tr");
          row.className =
            "shadow-lg text-white mx-auto text-center w-full mt-16";
          row.innerHTML = `
            <td>${item.libelle}</td>
            <td>${item.quantite}</td>
            <td>${item.prix}</td>
            <td>${item.total}</td>`;
          listePanier.appendChild(row);
        });
      })
      .catch((error) => console.error("Error fetching panier:", error));
  }

  // Ajouter un article au panier
  const buttonAddArticle = document.getElementById("buttonAddArticle");
  buttonAddArticle.addEventListener("click", (e) => {
    e.preventDefault();

    const articleId = document.getElementById("article").value;
    const quantite = document.getElementById("quantite").value;

    if (!articleId || !quantite) {
      alert("Veuillez sélectionner un article et spécifier une quantité");
      return;
    }

    fetch("/api/dettes/addArticle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article: articleId,
        quantite: quantite,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'article");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        loadPanier();
      })
      .catch((error) => console.error("Erreur :", error));
  });

  const formDette = document.getElementById("form-dette");
  formDette.addEventListener("submit", (e) => {
    e.preventDefault();

    const clientId = document.getElementById("client").value;
    if (!clientId) {
      alert("Veuillez sélectionner un client");
      return;
    }

    // Affichage du débogage avant la requête
    console.log(
      "Envoi de la requête pour créer une dette avec client_id:",
      clientId
    );

    fetch("/api/dettes/store", {
      method: "POST",
      body: JSON.stringify({
        client_id: clientId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la création de la dette");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dette créée avec succès:", data);
        alert("Dette créée avec succès !");
        formDette.reset();
        loadPanier();
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la dette:", error);
        alert("Erreur lors de la requête :", error);
      });
  });

  loadClient();
  loadArticle();
  loadPanier();
});
