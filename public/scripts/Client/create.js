document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-client");
  const toggleSwitch = document.getElementById("switch-user");
  const userFields = document.querySelectorAll(".user-field");
  const userForm = document.getElementById("user-form");

  // Initial state for user form
  userForm.style.display = "none";
  toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
      userForm.style.display = "block";
      console.log("oonn", this.checked);
      userFields.forEach((field) => {
        field.setAttribute("required", "required");
      });
    } else {
      userForm.style.display = "none";
      console.log("ooff", this.checked);
      userFields.forEach((field) => {
        field.removeAttribute("required"); // Supprimer l'attribut required
        field.value = ""; // Réinitialiser les champs
      });
    }
  });

  // Form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/clients/store", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error Response:", errorText);
        alert("Erreur lors de l'ajout du client: " + errorText);
      }

      const data = await response.json();

      if (data.error) {
        alert(`Erreur: ${data.error}`);
      } else {
        alert("Client créé avec succès !");
        form.reset();
        userForm.style.display = "none";
        userFields.forEach((field) => (field.disabled = true));
        window.location.href = "/clients";
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  });
});
