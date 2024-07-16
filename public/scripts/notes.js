let noteList = document.querySelector('.list-container');
let noteForm = document.querySelector('#note-form');
let saveNoteButton = document.querySelector('#save-note');
let noteTitleInput = document.querySelector('#title-input');
let noteTextInput = document.querySelector('#note-input');


const show = (elem) => {
  elem.style.display = 'inline';
};


const hide = (elem) => {
  elem.style.display = 'none';
};


const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });


const renderNotes = (notes) => {
  noteList.innerHTML = ''; 
  notes.forEach(note => {
    const card = document.createElement('div');
    card.classList.add('card', 'w-25', 'mb-3');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const noteTitle = document.createElement('h2');
    noteTitle.classList.add('data-title');
    noteTitle.textContent = note.noteTitle;

    const noteText = document.createElement('p');
    noteText.classList.add('data-text');
    noteText.textContent = note.noteText;

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash', 'bg-white', 'text-danger', 'border-0');
    trashButton.innerHTML = '<i class="bi bi-trash3-fill"></i>';

    cardBody.appendChild(noteTitle);
    cardBody.appendChild(noteText);
    cardBody.appendChild(trashButton);
    card.appendChild(cardBody);
    noteList.appendChild(card);
  });
};

const handleRenderSaveBtn = () => {
  if (!noteTitleInput.value.trim() || !noteTextInput.value.trim()) {
    hide(saveNoteButton);
  } else {
    show(saveNoteButton);
  }
};


getNotes().then(renderNotes);

hide(saveNoteButton);

noteTitleInput.addEventListener('keyup', handleRenderSaveBtn);
noteTextInput.addEventListener('keyup', handleRenderSaveBtn);
