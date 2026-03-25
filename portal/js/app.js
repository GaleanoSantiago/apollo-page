// Lógica del Dashboard

function loadContracts(user) {
    const container = document.getElementById('contractsContainer');
    // container.innerHTML = ... (Already set in HTML init)

    db.collection("contracts")
        .where("clientEmail", "==", user.email)
        .get()
        .then((querySnapshot) => {
            container.innerHTML = '';
            
            if (querySnapshot.empty) {
                container.innerHTML = '<div class="col-12"><p class="text-center">No tienes documentos asignados.</p></div>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const isSigned = data.status === 'signed';
                
                const statusBadge = isSigned 
                    ? '<span class="status-badge status-signed"><i class="fas fa-check"></i> Firmado</span>' 
                    : '<span class="status-badge status-pending"><i class="fas fa-clock"></i> Pendiente</span>';
                
                const dateStr = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '-';

                const cardHtml = `
                    <div class="col-md-4 mb-4">
                        <div class="doc-card h-100">
                            ${statusBadge}
                            <div class="mt-4">
                                <h5 class="mb-2 text-white">${data.title || 'Documento sin título'}</h5>
                                <p class="small text-muted mb-1"><i class="far fa-calendar-alt"></i> ${dateStr}</p>
                                <p class="small mb-3" style="color: #ccc;">${data.description || 'Sin descripción'}</p>
                                
                                <div class="d-grid">
                                    <a href="viewer.html?id=${doc.id}" class="btn btn-main">
                                        ${isSigned ? 'Ver Documento' : 'Firmar Ahora'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHtml;
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            container.innerHTML = '<div class="col-12 text-danger text-center">Error cargando documentos.</div>';
        });
}
