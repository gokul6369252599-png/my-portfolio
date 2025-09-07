document.addEventListener('DOMContentLoaded', () => {
    const bookGrid = document.getElementById('bookGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilters = document.querySelector('.category-filters');
    const bookDetailsModal = document.getElementById('bookDetailsModal');
    const modalDetails = document.getElementById('modalDetails');
    const closeModalButton = bookDetailsModal.querySelector('.close-button');
    const borrowingHistorySection = document.getElementById('borrowing-history');
    const historyList = document.getElementById('historyList');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // ✅ Updated book data with working image links
    let books = [
        {
            id: 1,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
            image: 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
            description: 'A philosophical novel about an Andalusian shepherd boy named Santiago who journeys to the Egyptian desert in search of a treasure.',
            category: 'fiction'
        },
        {
            id: 2,
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            year: 2011,
            image: 'https://covers.openlibrary.org/b/id/10572258-L.jpg',
            description: 'Explores the entire history of humanity, from the first humans to roam the earth to the radical—and sometimes devastating—advances of the Cognitive, Agricultural, and Scientific Revolutions.',
            category: 'history'
        },
        {
            id: 3,
            title: 'Dune',
            author: 'Frank Herbert',
            year: 1965,
            image: 'https://covers.openlibrary.org/b/id/9641652-L.jpg',
            description: 'Set in the distant future amidst a sprawling feudal interstellar empire where planetary fiefdoms are controlled by noble houses.',
            category: 'fantasy'
        },
        {
            id: 4,
            title: 'Cosmos',
            author: 'Carl Sagan',
            year: 1980,
            image: 'https://covers.openlibrary.org/b/id/240726-L.jpg',
            description: 'A popular science book that covers a wide range of scientific subjects, including the origin of life and the universe.',
            category: 'science'
        },
        {
            id: 5,
            title: 'The Diary of a Young Girl',
            author: 'Anne Frank',
            year: 1947,
            image: 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
            description: 'The personal diary of Anne Frank, a Jewish girl who hid with her family during the Nazi occupation of the Netherlands.',
            category: 'biography'
        },
        {
            id: 6,
            title: 'Educated',
            author: 'Tara Westover',
            year: 2018,
            image: 'https://covers.openlibrary.org/b/id/10587841-L.jpg',
            description: 'An autobiographical account of a young girl’s struggle for education and self-invention, growing up in a fundamentalist Mormon family in Idaho.',
            category: 'biography'
        }
    ];

    let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    // --- Core Functions ---
    function renderBooks(bookArray) {
        bookGrid.innerHTML = '';
        if (bookArray.length === 0) {
            bookGrid.innerHTML = '<p class="empty-message">No books found matching your criteria.</p>';
            return;
        }
        bookArray.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.setAttribute('data-id', book.id);

            bookCard.innerHTML = `
                <img src="${book.image}" alt="${book.title}">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p>${book.year}</p>
                    <span class="book-category">${book.category.charAt(0).toUpperCase() + book.category.slice(1)}</span>
                </div>
            `;
            bookCard.addEventListener('click', () => showBookDetails(book));
            bookGrid.appendChild(bookCard);
        });
    }

    function showBookDetails(book) {
        const isBorrowed = borrowedBooks.some(b => b.id === book.id);
        modalDetails.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="modal-text-content">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <p><strong>Category:</strong> ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}</p>
                <p>${book.description}</p>
                <button class="borrow-button ${isBorrowed ? 'borrowed' : ''}" ${isBorrowed ? 'disabled' : ''}>
                    ${isBorrowed ? 'Borrowed' : 'Borrow Book'}
                </button>
            </div>
        `;

        const borrowButton = modalDetails.querySelector('.borrow-button');
        borrowButton.replaceWith(borrowButton.cloneNode(true)); // ✅ Removes old listeners
        const newBorrowButton = modalDetails.querySelector('.borrow-button');

        if (!isBorrowed) {
            newBorrowButton.addEventListener('click', () => handleBorrow(book, newBorrowButton));
        }

        bookDetailsModal.classList.remove('hidden');
    }

    function handleBorrow(book, button) {
        if (!borrowedBooks.some(b => b.id === book.id)) {
            borrowedBooks.push({ ...book, borrowedDate: new Date().toLocaleDateString() });
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            button.textContent = 'Borrowed';
            button.classList.add('borrowed');
            button.disabled = true;
            renderBorrowingHistory();
            alert('${book.title} has been borrowed!');
        }
    }

    function renderBorrowingHistory() {
        historyList.innerHTML = '';
        if (borrowedBooks.length === 0) {
            historyList.innerHTML = '<p class="empty-message">No books borrowed yet. Start exploring!</p>';
            return;
        }
        borrowedBooks.forEach(book => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <img src="${book.image}" alt="${book.title}">
                <div class="history-details">
                    <h4>${book.title}</h4>
                    <p>by ${book.author}</p>
                    <p>Borrowed On: ${book.borrowedDate}</p>
                </div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    // --- Event Listeners ---
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            renderBooks(books);
            return;
        }
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
        renderBooks(filteredBooks);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            const filteredBooks = category === 'all'
                ? books
                : books.filter(book => book.category === category);
            renderBooks(filteredBooks);
        }
    });

    closeModalButton.addEventListener('click', () => {
        bookDetailsModal.classList.add('hidden');
    });

    // ✅ Initial Render
    renderBooks(books);
    renderBorrowingHistory();
});