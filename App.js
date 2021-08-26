// selectors
const addBookmarkButton = document.querySelector('#add-bookmark-button');
const formContainer = document.querySelector('.form-container');
const bookmarkForm = document.querySelector('.bookmark-info-form');
const nameInputElement = document.querySelector('.website-name-input');
const urlInputElement = document.querySelector('.website-url-input');
const submitButton = document.querySelector('#submit-button');
const bookmarksContainer = document.querySelector('.bookmarks-container');

// functions
function checkUrl(name, url) {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!name || !url) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!url.match(regex)) {
        alert('Please provide a valid web address.');
        return false;
    }
    // Valid
    return true;
}


function saveToLocalStorage(bookmark) {
    let bookmarks;
    if (!localStorage.getItem('bookmarks')) {
        bookmarks = [];
    } else {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

}

function getBookmarksFromLocalStorage() {
    let bookmarks;
    if (!localStorage.getItem('bookmarks')) {
        bookmarks = [];
    } else {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }

    bookmarks.forEach((bookmark) => {
        // create the whole bookmark item container
        const bookmarkItemContainer = document.createElement('div');
        bookmarkItemContainer.classList.add('bookmark-item-container');

        // create the bookmark close button container
        const bookmarkCloseButtonContainer = document.createElement('div')
        bookmarkCloseButtonContainer.classList.add('close-bookmark-button-container');
        // create the actual bookmark close button
        const bookmarkCloseButton = document.createElement('i');
        bookmarkCloseButton.classList.add('fas', 'fa-times');
        bookmarkCloseButton.addEventListener('click', deleteBookmark);

        // append the bookmarkCloseButton to the bookmarkCloseButtonContainer
        bookmarkCloseButtonContainer.append(bookmarkCloseButton);
        
        // create a bookmark item
        const bookmarkItem = document.createElement('div');
        bookmarkItem.classList.add('item-container');
        bookmarkItem.setAttribute('id', 'bookmark-item');


        bookmarkItem.addEventListener('click', () => window.open(bookmark.url, '_blank'));
        // create the favicon
        const img = document.createElement('img');
        img.src = `https://s2.googleusercontent.com/s2/favicons?domain=${bookmark.url}`;

        

        bookmarkItem.append(img);

        // bookmark name
        const bookmarkName = document.createElement('h3');
        bookmarkName.textContent = bookmark.name;
        bookmarkName.classList.add('bookmark-name')
        bookmarkItemContainer.append(bookmarkCloseButtonContainer, bookmarkItem, bookmarkName);

        bookmarksContainer.prepend(bookmarkItemContainer);
    })
}

function removeFromLocalStorage(bookmark) {
    let bookmarks;
    if (!localStorage.getItem('bookmarks')) {
        bookmarks = [];
    } else {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    
    const bookmarkName = bookmark.children[2].textContent;
    
    bookmarks.forEach((bookmark, index) => {
        if (bookmark.name === bookmarkName) {
            bookmarks.splice(index, 1);
        }
    })
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function deleteBookmark(event) {
    const item = event.target.classList[1];
    const target = event.target.parentElement.parentElement;
    
    if (item === 'fa-times') {
        target.classList.add('delete-bookmark');
        target.addEventListener('transitionend', () => target.remove());
        removeFromLocalStorage(target);
    }
}


function buildBookmark(name, url) {
    // create the whole bookmark item container
    const bookmarkItemContainer = document.createElement('div');
    bookmarkItemContainer.classList.add('bookmark-item-container');

    // create the bookmark close button container
    const bookmarkCloseButtonContainer = document.createElement('div')
    bookmarkCloseButtonContainer.classList.add('close-bookmark-button-container');
    // create the actual bookmark close button
    const bookmarkCloseButton = document.createElement('i');
    bookmarkCloseButton.classList.add('fas', 'fa-times');
    bookmarkCloseButton.addEventListener('click', deleteBookmark);

    // append the bookmarkCloseButton to the bookmarkCloseButtonContainer
    bookmarkCloseButtonContainer.append(bookmarkCloseButton);
    
    // create a bookmark item
    const bookmarkItem = document.createElement('div');
    bookmarkItem.classList.add('item-container');
    bookmarkItem.setAttribute('id', 'bookmark-item');


    bookmarkItem.addEventListener('click', () => window.open(url, '_blank'));
    // create the favicon
    const img = document.createElement('img');
    img.src = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`;

    

    bookmarkItem.append(img);

    // bookmark name
    const bookmarkName = document.createElement('h3');
    bookmarkName.textContent = name;
    bookmarkName.classList.add('bookmark-name')
    bookmarkItemContainer.append(bookmarkCloseButtonContainer, bookmarkItem, bookmarkName);

    bookmarksContainer.prepend(bookmarkItemContainer);
    

    // saving data to local storage
    let savedData = {
        name,
        url,
    }
    saveToLocalStorage(savedData);
}


function hideAndTakeDateFromForm(event) {
    event.preventDefault();
        let userWebsiteNameInput = nameInputElement.value;
        let userWebsiteUrlInput = urlInputElement.value;

        if (!userWebsiteUrlInput.includes('https://', 'http://')) {
            userWebsiteUrlInput = `https://${userWebsiteUrlInput}`
        } 
        
        if (!checkUrl(userWebsiteNameInput, userWebsiteUrlInput)) {
            return false;
        }

        formContainer.classList.remove('form-visible');

        nameInputElement.value = '';
        urlInputElement.value = '';

        buildBookmark(userWebsiteNameInput, userWebsiteUrlInput);
}

// eventlisteners
document.addEventListener('DOMContentLoaded', getBookmarksFromLocalStorage);
addBookmarkButton.addEventListener('click', () => {
    formContainer.classList.add('form-visible');
})
bookmarkForm.addEventListener('submit', hideAndTakeDateFromForm);

formContainer.addEventListener('click', (event) => {
    if (event.target.classList[0] === 'form-container') {
        formContainer.classList.remove('form-visible');
    }
})
