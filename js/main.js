// Animacion de astronauta
const astronaut = document.querySelector(".img-pet img");
const titlePage = document.querySelectorAll(".title-page");
const logo = document.querySelector(".img-logo img");
const containerFooter = document.querySelector(".text-footer");

astronaut.addEventListener("animationend", (e) => {
  if (e.animationName === "dropDown") {
    astronaut.style.animation = "float 4s ease-in-out infinite";
    titlePage.forEach(title=>{
      title.style.opacity=1;

    })
    logo.style.opacity=1;
    containerFooter.style.opacity=1;
  }
});
