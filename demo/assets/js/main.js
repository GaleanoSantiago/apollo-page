fetch("./assets/bd.json")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector(".custo-options");

    Object.entries(data.oso_peluche).forEach(([parte, variantes]) => {
        setPart(parte, variantes[0].elemento);
        const row = document.createElement("div");
        row.className = "custo-row";

        const title = document.createElement("h3");
        title.className = "custo-title";
        title.textContent = parte.charAt(0).toUpperCase() + parte.slice(1);

        const gallery = document.createElement("div");
        gallery.className = "custo-galery";

        
        variantes.forEach(item => {
            const card = document.createElement("div");
            card.className = "custo-item";

            card.innerHTML = `
            <div class="custo-item-info">
                <img class="custo-icon" src="./assets/img/oso_cthulhu/${item.icono}" alt="${item.nombre}">
                <span class="custo-name">${item.nombre}</span>
                <span class="custo-price">$${item.precio}</span>
            </div>
            `;
            card.dataset.part = parte;            // ears, face, arms...
            card.dataset.image = item.elemento;   // imagen real

            gallery.appendChild(card);

        });
        // para quitar el elemento
        const removeCard = document.createElement("div");
        removeCard.className = "custo-item custo-remove";
        removeCard.textContent = "Quitar";

        removeCard.dataset.part = parte;
        removeCard.dataset.remove = "true";

        if(title.textContent=="Torso"){

            gallery.appendChild(removeCard);
        }
        

      row.append(title, gallery);
      container.appendChild(row);
    });
  })
  .catch(err => console.error("Error cargando bd.json", err));

  
const lienzo = document.querySelector(".lienzo");

function setPart(parte, imgSrc){
    let img = lienzo.querySelector(`.${parte}`);

    if(!img){
        img = document.createElement("img");
        img.classList.add(parte);
        // img.crossOrigin = "anonymous";

        lienzo.appendChild(img);
    }

    img.src = `./assets/img/oso_cthulhu/${imgSrc}`;

}

document.addEventListener("click", e => {
    const item = e.target.closest(".custo-item");
    if(!item) return;
    const part = item.dataset.part;

    // Quitar parte
    if(item.dataset.remove){
        lienzo.querySelectorAll(`.${part}`).forEach(el => el.remove());
        return;
    }

    // Setear parte normal
    setPart(part, item.dataset.image);
});


// descargar imagen del lienzo

document.getElementById("download-lienzo").addEventListener("click", () => {

    const lienzo = document.querySelector(".lienzo");

    html2canvas(lienzo, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        removeContainer: true
    }).then(canvas => {

        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "mi-oso-personalizado.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }).catch(err => {
        console.error(err);
    });

});



// ---------- colores ---------------

const COLOR_FILTERS = {
    blue:   "sepia(1) saturate(5) hue-rotate(190deg)",
    yellow: "sepia(1) saturate(6) hue-rotate(20deg) brightness(1.1)",
    violet: "sepia(1) saturate(5) hue-rotate(260deg)",
    red:    "sepia(1) saturate(5) hue-rotate(-10deg)",
    reset:  ""
  };
  
  document.addEventListener("click", e => {
      const color = e.target.closest(".color-item");
      if(!color) return;
  
      const filter = COLOR_FILTERS[color.dataset.filter];
  
      document.querySelectorAll(".lienzo img").forEach(img => {
          img.style.filter = filter;
      });
  });
  