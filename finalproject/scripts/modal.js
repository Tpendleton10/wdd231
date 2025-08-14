// modal.js
export function setupModal() {
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector(".modal-content");
  const closeBtn = modal.querySelector(".close-btn");

  function openModal(contentHTML) {
    modalContent.innerHTML = contentHTML;
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  }

  function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") closeModal();
  });

  return { openModal, closeModal };
}
