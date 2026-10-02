document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const createNoteBtn = document.getElementById('createNoteBtn');
  const notesContainer = document.getElementById('notesContainer');

  // Load Saved Notes from LocalStorage
  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('user_notes')) || [];
    notesContainer.innerHTML = '';

    savedNotes.forEach(text => {
      createNoteElement(text);
    });
  };

  // Save Current Notes State to LocalStorage
  const saveNotes = () => {
    const notesArray = [];
    const noteParagraphs = notesContainer.querySelectorAll('.note-card p');

    noteParagraphs.forEach(p => {
      notesArray.push(p.innerText);
    });

    localStorage.setItem('user_notes', JSON.stringify(notesArray));
  };

  // Create Single Note Element DOM Structure
  const createNoteElement = (text = '') => {
    // Note Card Parent Container
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    // Content Editable Paragraph
    const paragraph = document.createElement('p');
    paragraph.setAttribute('contenteditable', 'true');
    paragraph.innerText = text;

    // Delete Icon
    const deleteBtn = document.createElement('i');
    deleteBtn.className = 'fa-solid fa-trash-can delete-btn';

    // Append Elements
    noteCard.appendChild(paragraph);
    noteCard.appendChild(deleteBtn);
    notesContainer.appendChild(noteCard);

    // Focus on newly created note
    if (!text) {
      paragraph.focus();
    }

    // Input Event: Auto-save on typing
    paragraph.addEventListener('input', () => {
      saveNotes();
    });

    // Delete Event: Remove note and update storage
    deleteBtn.addEventListener('click', () => {
      noteCard.style.transform = 'scale(0.9)';
      noteCard.style.opacity = '0';
      noteCard.style.transition = 'all 0.2s ease';
      
      setTimeout(() => {
        noteCard.remove();
        saveNotes();
      }, 200);
    });
  };

  // Create Note Button Click Handler
  createNoteBtn.addEventListener('click', () => {
    createNoteElement();
    saveNotes();
  });

  // Initial Load
  loadNotes();
});