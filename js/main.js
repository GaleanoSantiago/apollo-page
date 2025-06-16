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
  const section = document.querySelector("#especialidades");
  const navbar = document.querySelector("#navbar");
  const timelineFill = document.querySelector(".timeline-fill");
  const boxTl = document.querySelectorAll(".box-tl");
  const sectionTrabajos = document.querySelector(".contenedor-proyectos:not(.d-none)");

  const totalDuration = 4;
  let animacionesEjecutadas = false;
  let animacionesEjecutadas2 = false;

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
    const sectionTrabajosTop = sectionTrabajos.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || document.documentElement.scrollTop;


    if (!animacionesEjecutadas && sectionTop < windowHeight - 100) {
      activarAnimaciones();
      animacionesEjecutadas = true;
    }
    // Animacion scroll de trabajos
    if (!animacionesEjecutadas2 && sectionTrabajosTop < windowHeight - 100) {
      // animationGalery(proyectos[currentIndex]);
      animationGalery(proyectos[0]);
      animacionesEjecutadas2 = true;
    }
    // Fijar navbar si scroll > 800px
    if (scrollY >= 400) {
      navbar.classList.add("fixed");
    } else {
      navbar.classList.remove("fixed");
    }
  });
});

const proyectos = document.querySelectorAll(".contenedor-proyectos");
const botones = document.querySelectorAll(".arrow-block");
const btnAnterior = document.querySelector(".arrow-back");
const btnSiguiente = document.querySelector(".arrow-next");

let currentIndex = 0; // Guarda el índice del proyecto visible actualmente

// Función para cambiar de proyecto
function cambiarProyecto(nuevoIndex) {
  if (nuevoIndex < 0 || nuevoIndex >= proyectos.length) return;

  const proyectoActual = proyectos[currentIndex];
  const proyectoSiguiente = proyectos[nuevoIndex];

  if (proyectoActual === proyectoSiguiente) return;

  animateExit(proyectoActual).then(() => {
    // Ocultar todos los proyectos y mostrar el siguiente
    proyectos.forEach((p) => p.classList.add("d-none"));
    proyectoSiguiente.classList.remove("d-none");

    // Animar entrada del nuevo
    animationGalery(proyectoSiguiente);

    // Actualizar índice actual
    currentIndex = nuevoIndex;

    // Actualizar clase 'active' en botones
    botones.forEach((btn, i) => {
      btn.classList.toggle("active", i === currentIndex);
    });
  });
}

// Escuchar clicks en botones numerados
botones.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    cambiarProyecto(index);
  });
});

// Escuchar botón "Anterior"
btnAnterior.addEventListener("click", () => {
  cambiarProyecto(currentIndex - 1);
});

// Escuchar botón "Siguiente"
btnSiguiente.addEventListener("click", () => {
  cambiarProyecto(currentIndex + 1);
});

function animationGalery(proyecto) {
  const boxBlock = proyecto.querySelectorAll(".box-block");
  boxBlock.forEach((block, i) => {
    anime({
      targets: block,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: i * 200,
      easing: "easeOutCubic"
    });
  });
}

function animateExit(proyecto) {
  return new Promise((resolve) => {
    const boxBlock = proyecto.querySelectorAll(".box-block");
    let completions = 0;

    boxBlock.forEach((block, i) => {
      anime({
        targets: block,
        opacity: [1, 0],
        translateY: [0, -30],
        duration: 500,
        delay: i * 100,
        easing: "easeInCubic",
        complete: () => {
          completions++;
          if (completions === boxBlock.length) {
            resolve(); // Ejecutar luego de todas las animaciones
          }
        }
      });
    });

    // Si no hay elementos para animar, resolvemos inmediatamente
    if (boxBlock.length === 0) resolve();
  });
}

