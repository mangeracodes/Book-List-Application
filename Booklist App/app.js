//book class
    class Book{
        
        // book constructor
        constructor(title, author, isbn){
            this.title = title;
            this.author = author;
            this.isbn = isbn;
        }
    };

//UI Class
    class UI{

        //display
            static displayBooks(){
                
                const books = LocalStore.getBooks();
                console.log(books);
                books.forEach((book) => UI.addBooktoList(book));
            };

        //filter items
            static filterItems(targetElement){
    
                //convert to lowercase
                var text = targetElement.value.toLowerCase();
        
                var table = document.querySelector('.table');
                var rows = table.getElementsByTagName('tr');
                 
                //filter list
                Array.from(rows).forEach(function(row){
                    
                    var tdTitle = row.getElementsByTagName('td')[0];

                    if(tdTitle){
                        var bookName = tdTitle.textContent;
                        //console.log(bookName);
                        if(bookName.toLowerCase().indexOf(text) != -1){
                            row.style.display = '';
                        }
                        else{
                            row.style.display = 'none';
                        }
                    }
                });
        };

        //add book to list
            static addBooktoList(book){
                
                const list = document.querySelector('#book-list');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
                `;

                list.appendChild(row);
            };

        //get input from form and return new book object
            static getInputfromForm(){
                
                //get form values
                const title = document.querySelector('#title').value;
                const author = document.querySelector('#author').value;
                const isbn = document.querySelector('#isbn').value;
                
                //validation
                if(title === '' || author === '' || isbn === ''){
                    
                    //show error alert
                    UI.showAlert('Please fill in all fields', 'danger');
                }
                else{
                    //instantiate new book
                    const book = new Book(title, author, isbn);

                    //show success alert
                    UI.showAlert('Book added successfully!', 'success');

                    return book;
                }
            };

        //remove book from list
            static removeBookfromList(targetElement){
                if(targetElement.classList.contains('delete')){
                    targetElement.parentElement.parentElement.remove();

                    //show success alert
                        UI.showAlert('Book removed successfully!', 'success');
                };
        };

        //Alerts for validation
            static showAlert(message, className){
                
                //create div
                const divAlert = document.createElement('div');
                divAlert.className = `alert alert-${className}`;
                divAlert.appendChild(document.createTextNode(message));
                
                //insert div alert
                const container = document.querySelector('.container');
                const bookForm = document.querySelector('#book-form');
                container.insertBefore(divAlert, bookForm);

                //setting timeout
                setTimeout(() => document.querySelector('.alert').remove(), 2500);
            };

    }

//local storage class
    class LocalStore{

        //get all Books
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

        //add a book
            static addBook(book){
                const books = LocalStore.getBooks();
                books.push(book);
                localStorage.setItem('books', JSON.stringify(books));
            }

        //remove a book
            static removeBook(isbn){
                const books = LocalStore.getBooks();

                books.forEach((book, index) =>{
                    if(book.isbn == isbn){
                        books.splice(index, 1);
                    }
                });

                localStorage.setItem('books', JSON.stringify(books));
            }

    }


//event to display book
    document.addEventListener('DOMContentLoaded', UI.displayBooks);

//UI event to add book'
    document.querySelector('#book-form').addEventListener('submit', (e) =>{
        e.preventDefault();
        
        //get book from input
        let book = UI.getInputfromForm();
        
        //add book to UI
        UI.addBooktoList(book);

        //add book to storage
        LocalStore.addBook(book);

        //clear fields
        document.querySelector('#book-form').reset();
    });

//event to filter books
    document.querySelector('#filter').addEventListener('keyup', (e) =>{
        UI.filterItems(e.target);
    });

//event to remove book
    document.querySelector("#book-list").addEventListener('click', (e)=>{
        
        //remove book from UI
        UI.removeBookfromList(e.target);
        
        //remove book from storage
        LocalStore.removeBook(e.target.parentElement.previousElementSibling.textContent);
    });