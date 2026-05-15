document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".Login-Usuario").addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value.trim();
        
        login(email, password);
    })
});

async function login(email,password) {
    try {
      const resposta = await fetch(`http://localhost:3000/usuarios?email=${email}&senha=${password}`);

      const dados = await resposta.json();

      if (dados.length > 0) {
        alert("Login bem-sucedido!");

        localStorage.setItem("usuarioLogado", JSON.stringify(dados[0]));

      } else {
        alert("Email ou senha incorretos.");
      }
    }
    catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      alert("Erro ao tentar fazer login. Por favor, tente novamente.");
    }
}