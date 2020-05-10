//Book Class: Represents a Book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI{
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-small delete">X</a></td>
            `;
        list.appendChild(row);
    }

    static clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    static deleteBook(e){
        if(e.target.classList.contains('delete')){
            var li = e.target.parentElement.parentElement;
            document.querySelector('#book-list').removeChild(li); //e.parentElement.parentElement.remove();
        }
    }

    //Show alert message
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000); 
    }
}

//Store Class: for Local Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate book
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else{
        //Instantiate a book
        const book = new Book(title, author, isbn);

        //Add Book to UI
        UI.addBookToList(book);

        //Add Book to Store
        Store.addBook(book);

        UI.showAlert('Book Added', 'success');

        //Clear fields
        UI.clearFields();
    }
});

//Event: Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e);

    //Remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'danger');
});