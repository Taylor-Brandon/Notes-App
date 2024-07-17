let noteList = document.querySelector('.list-container');
let noteForm = document.querySelector('#note-form');
let saveNoteButton = document.querySelector('#save-note');
let newNoteButton = document.querySelector('#new-note');
let noteTitleInput = document.querySelector('#title-input');
let noteTextInput = document.querySelector('#note-input');

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

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

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const renderActiveNote = () => {
  hide(saveNoteButton);

  if (activeNote.noteTitle) {
    noteTitleInput.setAttribute('readonly', true);
    noteTextInput.setAttribute('readonly', true);
    noteTitleInput.value = activeNote.noteTitle;
    noteTextInput.value = activeNote.noteText;
  } else {
    noteTitleInput.removeAttribute('readonly');
    noteTextInput.removeAttribute('readonly');
    noteTitleInput.value = '';
    noteTextInput.value = '';
  }
};

const handleNoteView = (e) => {
  e.preventDefault();
  const noteElement = e.target.closest('.card-body');
  const noteTitle = noteElement.querySelector('.data-title').textContent;
  const noteText = noteElement.querySelector('.data-text').textContent;

  activeNote = {
    noteTitle,
    noteText,
  };

  renderActiveNote();
};

const renderNotes = (notes) => {
  show(newNoteButton);
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

    cardBody.addEventListener('click', handleNoteView);
  });
};

const handleRenderSaveBtn = () => {
  if (!noteTitleInput.value.trim() || !noteTextInput.value.trim()) {
    hide(saveNoteButton);
  } else {
    show(saveNoteButton);
  }
};

const handleNoteSave = () => {
  const newNote = {
    noteTitle: noteTitleInput.value,
    noteText: noteTextInput.value,
  };

  saveNote(newNote).then(() => {
    getNotes().then(renderNotes);
    noteTitleInput.value = '';
    noteTextInput.value = '';
    hide(saveNoteButton);
  });
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

getNotes().then(renderNotes);

hide(saveNoteButton);

noteTitleInput.addEventListener('input', handleRenderSaveBtn);
noteTextInput.addEventListener('input', handleRenderSaveBtn);
saveNoteButton.addEventListener('click', handleNoteSave);
newNoteButton.addEventListener('click', handleNewNoteView);

