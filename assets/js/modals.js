// Modal functionality. Modal HTML is authored directly in index.html.
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
}

window.addEventListener("click", function(e) {
    if (e.target.classList.contains("modal")) {
        closeModal(e.target.id);
    }
});

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("close")) {
        const modal = e.target.closest(".modal");
        if (modal) {
            closeModal(modal.id);
        }
    }
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        document.querySelectorAll(".modal").forEach(modal => {
            if (modal.style.display === "block") {
                closeModal(modal.id);
            }
        });
    }
});
