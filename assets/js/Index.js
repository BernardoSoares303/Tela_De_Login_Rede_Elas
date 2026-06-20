const linksMenu = document.querySelectorAll("nav a[href^='#']");

linksMenu.forEach((link) => {
  link.addEventListener("click", function () {
    linksMenu.forEach((item) => item.classList.remove("ativo"));
    this.classList.add("ativo");
  });
});
