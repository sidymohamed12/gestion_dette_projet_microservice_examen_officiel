document.addEventListener("DOMContentLoaded", () => {
  // pou role :
  fetch("/api/roles")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      return response.json();
    })
    .then((roles) => {
      const roleSelect = document.getElementById("role");
      roles.forEach((role) => {
        const option = document.createElement("option");
        option.value = role;
        option.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        roleSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching roles:", error));

  // è---------------------------------------------

  const form = document.getElementById("form-login");
  form.addEventListener("submit", async () => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      login: formData.get("login"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      const response = await fetch("/api/users/store", {
        method: "POST",
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        const result = await response.json;
        alert(`Utilisateur créé avec succès! ID: ${result.id}`);
        form.reset();
        window.location.href = "/users";
      } else {
        const error = await response.json();
        alert(
          `Erreur : ${
            error.error || "Une erreur est survenue lors de l'insertion"
          }`
        );
      }
    } catch (error) {
      alert("Erreur lors de la requête :", error);
    }
  });
});

// form.addEventListener("submit", () => {
//   const login = document.getElementById("login").value;
//   const password = document.getElementById("password").value;

//   if (login === "admin" && password === "password") {
//     window.location.href = "/admin";
//   } else {
//     alert("Identifiants incorrects");
//   }

//   return false;
// });
