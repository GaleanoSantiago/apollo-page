// Animacion de astronauta
const astronaut = document.querySelector(".img-pet img");
const titlePage = document.querySelectorAll(".title-page");
const logo = document.querySelector(".img-logo img");
const btnMain = document.querySelector(".n_contacto_div .btn-main")
const containerFooter = document.querySelector(".text-footer");

astronaut.addEventListener("animationend", (e) => {
  if (e.animationName === "dropDown") {
    astronaut.style.animation = "float 4s ease-in-out infinite";
    titlePage.forEach(title=>{
      title.style.opacity=1;

    })
    btnMain.style.opacity=1;
    logo.style.opacity=1;
    containerFooter.style.opacity=1;
  }
});

// Animacion del phone-inicio img
const boxes = document.querySelectorAll(".phone-box");
const presentacionImg = document.querySelector(".container-img-inicio");
const divInicio = document.getElementById("top-page");

function animateBoxes(boxes, add = true, i = 0) {
  if (i >= boxes.length) return;

  if (add) {
    boxes[i].classList.add("in-place");
  } else {
    boxes[i].classList.remove("in-place");
  }

  setTimeout(() => animateBoxes(boxes, add, i + 1), 100);
}

let animating = false;

// Esperar a que la animacion de dropDown termine antes de desglozar las cartas
presentacionImg.addEventListener("animationend", (e) => {
  
  if (e.animationName === "dropDownMain") {
    // Inicializar con animación completa
    animateBoxes(boxes, false);

    
    divInicio.addEventListener("mouseenter", () => {
      if (animating) return;
      animating = true;
      animateBoxes(boxes, false); // Quita la clase
      setTimeout(() => animating = false, boxes.length * 100);
    });

    divInicio.addEventListener("mouseleave", () => {
      if (animating) return;
      animating = true;
      animateBoxes(boxes, true); // Agrega la clase
      setTimeout(() => animating = false, boxes.length * 100);
    });

  }
});


document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section#especialidades");
  const timelineFill = document.querySelector(".timeline-fill");
  const boxTl = document.querySelectorAll(".box-tl");
  const totalDuration = 4;
  let animacionesEjecutadas = false;

  // Paso 1: Asegurar que todos tengan la clase fadeup desde el inicio
  boxTl.forEach((el) => {
    el.classList.add("fadeup");
  });

  function activarAnimaciones() {
    // Activar línea de tiempo
    timelineFill.style.animation = `expandLine 7s ease forwards`;

    // Activar fadeup en las cajas con delay escalonado
    boxTl.forEach((el, index) => {
      let groupIndex = index % 3;
      let delay = ((groupIndex + 1) * totalDuration) / 3;
      el.style.animation = `fadeUp 1s ease-out ${delay}s forwards`;

      el.addEventListener("animationend", () => {
        el.classList.remove("fadeup");
        el.style.animation = ""; // Limpiar para posibles futuras repeticiones
      });
    });
  }

  // Scroll listener
  window.addEventListener("scroll", () => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (!animacionesEjecutadas && sectionTop < windowHeight - 100) {
      activarAnimaciones();
      animacionesEjecutadas = true;
    }
  });
});
