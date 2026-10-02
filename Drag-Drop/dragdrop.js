document.addEventListener('DOMContentLoaded', () => {
  const listItems = document.querySelectorAll('.list-item');
  const containers = document.querySelectorAll('.drag-container');

  let draggedItem = null;

  // Setup Event Listeners for Each Draggable Item
  listItems.forEach(item => {
    // 1. Desktop HTML5 Drag Events
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      setTimeout(() => item.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      draggedItem = null;
    });

    // 2. Mobile Touch Drag Events
    item.addEventListener('touchstart', (e) => {
      draggedItem = item;
      item.classList.add('dragging');
    }, { passive: true });

    item.addEventListener('touchmove', (e) => {
      if (!draggedItem) return;

      const touch = e.touches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (targetElement) {
        const currentContainer = targetElement.closest('.drag-container');
        containers.forEach(c => c.classList.remove('drag-over'));
        if (currentContainer) {
          currentContainer.classList.add('drag-over');
        }
      }
    }, { passive: true });

    item.addEventListener('touchend', (e) => {
      if (!draggedItem) return;

      const touch = e.changedTouches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (targetElement) {
        const currentContainer = targetElement.closest('.drag-container');
        if (currentContainer) {
          currentContainer.appendChild(draggedItem);
        }
      }

      containers.forEach(c => c.classList.remove('drag-over'));
      draggedItem.classList.remove('dragging');
      draggedItem = null;
    });
  });

  // Setup Container Drag & Drop Target Handlers
  containers.forEach(container => {
    container.addEventListener('dragover', (e) => {
      e.preventDefault(); // Required to allow drop
      container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('drag-over');
      
      if (draggedItem) {
        container.appendChild(draggedItem);
      }
    });
  });
});