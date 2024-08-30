"use strict";

const addBookBtn = document.getElementById("addbook-btn");
const closePopupButton = document.getElementById("closePopupButton");
const addBookForm = document.getElementById("addbook-form");
const submitForm = document.getElementById("myForm");

const inputBookTitle = document.getElementById("bookTitle");
const inputBookAuthor = document.getElementById("bookAuthor");
const inputBookPages = document.getElementById("bookPages");
const inputBookRead = document.getElementById("bookRead");

const containerBooks = document.querySelector(".library-row");
const readInidicators = document.querySelectorAll(".read-indicator");

let myLibrary = [];

// Book constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
        return `${title} by ${author}, ${pages} pages, ${
            read ? "already read" : "not read yet"
        }`;
    };
}

/** FUNCTIONS */

const addBookToLibrary = function (title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));

    persistLibrary(); // Add to local storage
};

const displayBooksInLibrary = function (library) {
    containerBooks.innerHTML = "";
    library.forEach((book, i) => {
        const read = book.read ? "Already read" : "Not read yet";
        const readIndicator = book.read ? "unread" : "read";
        const markRead =
            readIndicator === "read"
                ? "Mark as <br/ >read"
                : "Mark <br/ > not read";
        const html = `
        <div class="library-column library-column--${i}">
            <div class="book">
                <span class="close" id="removeBookButton--${i}">&times;</span>
                <h2>${book.title}</h2>
                <h3>by ${book.author}</h3>
                <p>${book.pages} pages</p>
                <p2 class="bookread--${book.read}"">${read} </p2>
                <div class="${readIndicator}-indicator" id="${readIndicator}--${i}">${markRead}</div>
                
            </div>
        </div>`;
        containerBooks.insertAdjacentHTML("afterbegin", html);

        // Event for remove button
        document
            .getElementById(`removeBookButton--${i}`)
            .addEventListener("click", function () {
                document.querySelector(`.library-column--${i}`).style.display =
                    "none";
                myLibrary.splice(i, 1);

                persistLibrary();
            });

        // Event for mark read/unread button
        document
            .getElementById(`${readIndicator}--${i}`)
            .addEventListener("click", function () {
                myLibrary[i].read = !myLibrary[i].read;
                // Update local storage
                persistLibrary();
                displayBooksInLibrary(myLibrary);
            });
    });
};

const toggleRead = function (book) {
    // Toggle the 'read' class on the book
    book.read ? book.classList.toggle("read") : book.classList.toggle("unread");
};

const persistLibrary = function () {
    localStorage.setItem("library", JSON.stringify(myLibrary));
};

const init = function () {
    const storage = localStorage.getItem("library");
    if (storage) myLibrary = JSON.parse(storage);
    console.log(myLibrary);

    /** Display initial data */
    displayBooksInLibrary(myLibrary);
};

/** EVENTS */

addBookBtn.addEventListener("click", function (e) {
    e.preventDefault();
    // Toggle the visibility of the form
    addBookForm.style.display = "block";
});
// Submit new book
submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    myLibrary.push(
        new Book(
            inputBookTitle.value,
            inputBookAuthor.value,
            inputBookPages.value,
            inputBookRead.checked
        )
    );
    // Update local storage
    persistLibrary();
    // Clear fields
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
    inputBookPages.value = "";
    inputBookRead.checked = false;
    // Hide Form
    addBookForm.style.display = "none";
    // Display library
    displayBooksInLibrary(myLibrary);
});

closePopupButton.addEventListener("click", function () {
    addBookForm.style.display = "none";
});

readInidicators.forEach(function (indicator) {
    indicator.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents the click event from propagating to the book element
        toggleRead(this.parentElement); // Toggle the 'read' class on the parent book element
    });
});

/** Default data */
// addBookToLibrary("The Hobbit", "J. R. R. Tolkien", 295, true);
// addBookToLibrary("A Game of Thrones", "George R. R. Martin", 694, false);
// addBookToLibrary(
//     "Harry Potter and the Philosopher's Stone",
//     "J. K. Rowling",
//     183,
//     false
// );
// addBookToLibrary("A Wizard of Earthsea", "Ursula K. Le Guin", 224, false);

init();
