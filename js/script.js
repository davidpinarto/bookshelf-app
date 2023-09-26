document.addEventListener("DOMContentLoaded", function () {
  const bookshelf = [];

  const RENDER_EVENT = "render-books";

  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const createId = generateId();
    const book = generateBookDataToObject(
      createId,
      title,
      author,
      year,
      isComplete
    );

    bookshelf.push(book);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateBookDataToObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    uncompleteBookshelfList.innerHTML = "";
    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );
    completeBookshelfList.innerHTML = "";

    for (const book of bookshelf) {
      const bookElement = makeBookElement(book);

      if (!book.isComplete) {
        uncompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
    }
  });

  function makeBookElement(bookObject) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = bookObject.year;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book_item");
    bookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);

    if (bookObject.isComplete) {
      const notFinishedReadingButton = document.createElement("button");
      notFinishedReadingButton.classList.add("green");
      notFinishedReadingButton.innerText = "Belum selesai dibaca";

      const deleteBookButton = document.createElement("button");
      deleteBookButton.classList.add("red");
      deleteBookButton.innerText = "Hapus buku";

      actionContainer.append(notFinishedReadingButton, deleteBookButton);

      notFinishedReadingButton.addEventListener("click", function () {
        undoToUncompleteRead(bookObject.id);
      });

      deleteBookButton.addEventListener("click", function () {
        removeBook(bookObject.id);
      });
    } else {
      const completeReadingButton = document.createElement("button");
      completeReadingButton.classList.add("green");
      completeReadingButton.innerText = "Selesai dibaca";

      const deleteBookButton = document.createElement("button");
      deleteBookButton.classList.add("red");
      deleteBookButton.innerText = "Hapus buku";

      actionContainer.append(completeReadingButton, deleteBookButton);

      completeReadingButton.addEventListener("click", function () {
        finishedBook(bookObject.id);
      });

      deleteBookButton.addEventListener("click", function () {
        removeBook(bookObject.id);
      });
    }

    return bookContainer;
  }

  function finishedBook(bookId) {
    const bookTarget = findBook(bookId);

    if (!bookTarget) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const book of bookshelf) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }

  function undoToUncompleteRead(bookId) {
    const bookTarget = findBook(bookId);

    if (!bookTarget) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);

    if (bookIndex === null) return;

    bookshelf.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    let index = null;
    bookshelf.forEach((nilaiArray, nilaiIndex) => {
      if (nilaiArray.id === bookId) {
        index = nilaiIndex;
      }
    });
    return index;
  }

  const SAVED_EVENT = "saved-book";
  const STORAGE_KEY = "BOOKSHELF_APPS";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(bookshelf);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const getData = localStorage.getItem(STORAGE_KEY);
    const parseData = JSON.parse(getData);

    if (parseData !== null) {
      for (const book of parseData) {
        bookshelf.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
