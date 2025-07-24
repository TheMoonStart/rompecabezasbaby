const board = document.getElementById("puzzle-board");
const container = document.getElementById("pieces-container");

const gridSize = 4;
const pieceSize = 80;
let pieces = [];

function createSlots() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;
    slot.addEventListener("dragover", e => e.preventDefault());
    slot.addEventListener("drop", handleDrop);
    board.appendChild(slot);
  }
}

function createPieces() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
      piece.dataset.correctIndex = index;
      piece.dataset.source = "tray";
      piece.draggable = true;
      piece.addEventListener("dragstart", handleDragStart);
      pieces.push(piece);
    }
  }

  pieces.sort(() => 0.5 - Math.random());
  pieces.forEach(p => container.appendChild(p));
}

let draggedPiece = null;
let originContainer = null;

function handleDragStart(e) {
  draggedPiece = e.target;
  originContainer = e.target.parentNode;
  setTimeout(() => {
    e.target.classList.add("hidden");
  }, 0);
}

function handleDrop(e) {
  if (!draggedPiece) return;

  const targetSlot = e.target.closest(".slot");

  // Si ya hay una pieza, devuélvela a la bandeja o al slot anterior
  if (targetSlot && !targetSlot.contains(draggedPiece)) {
    if (targetSlot.firstChild) {
      const replacedPiece = targetSlot.firstChild;
      if (originContainer.classList.contains("pieces-container")) {
        container.appendChild(replacedPiece);
      } else {
        originContainer.appendChild(replacedPiece);
      }
    }

    targetSlot.innerHTML = "";
    targetSlot.appendChild(draggedPiece);
    draggedPiece.dataset.source = "board";
    draggedPiece.classList.remove("hidden");
    draggedPiece.draggable = true;
    draggedPiece.addEventListener("dragstart", handleDragStart);
  }

  checkComplete();
}

document.addEventListener("dragend", () => {
  if (draggedPiece) draggedPiece.classList.remove("hidden");
  draggedPiece = null;
});

function checkComplete() {
  const slots = document.querySelectorAll(".slot");
  const isComplete = [...slots].every(slot => {
    const piece = slot.querySelector(".piece");
    return piece && piece.dataset.correctIndex == slot.dataset.index;
  });

  if (isComplete) {
    setTimeout(() => {
      const modal = document.getElementById("romanticModal");
      modal.style.display = "block";
    }, 100);
  }
}

// Cerrar modal con la X
document.getElementById("closeModal").onclick = function() {
  document.getElementById("romanticModal").style.display = "none";
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById("romanticModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

createSlots();
createPieces();
