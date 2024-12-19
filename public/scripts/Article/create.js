document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-article");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      libelle: formData.get("libelle"),
      qteStock: parseInt(formData.get("qteSock")),
      prix: parseFloat(formData.get("prix")),
    };

    try {
      const response = await fetch("/api/articles/store", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Article créé avec succès ! ID: ${result.id}`);
        form.reset();
        window.location.href = "/articles";
      } else {
        const error = await response.json();
        alert(`Erreur : ${error.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      alert("Erreur lors de la requête :", error);
    }
  });
});
