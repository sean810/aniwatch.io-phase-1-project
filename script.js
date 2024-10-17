const animeList = document.getElementById('animeList');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const toggleThemeButton = document.getElementById('toggleTheme');
const underratedButton = document.getElementById('underratedButton');
let darkMode = false;

// Fetch and display animes on page load
async function fetchAnimes() {
    try {
        const response = await fetch('http://localhost:3000/animes');
        if (!response.ok) throw new Error('Network response was not ok');
        const animes = await response.json();
        displayAnimes(animes);
    } catch (error) {
        console.error('Fetch error:', error);
        animeList.innerHTML = '<li>Error loading anime data. Please try again later.</li>';
    }
}

// Display animes in the list
function displayAnimes(animes) {
    animeList.innerHTML = animes.map(anime => 
        `<li data-id="${anime.id}">
            <img src="${anime.poster || 'https://via.placeholder.com/300'}" alt="${anime.title} Poster" onerror="this.onerror=null; this.src='https://via.placeholder.com/300';">
            <div>
                <strong>${anime.title}</strong><br>
                Genre: ${anime.genre} | Rating: ${anime.rating}<br>
                <p>${anime.description || 'No description available.'}</p>
            </div>
        </li>`
    ).join('');
    addClickEventToAnimes();
}

// Add click event to each anime list item
function addClickEventToAnimes() {
    const animeItems = document.querySelectorAll('#animeList li');
    animeItems.forEach(item => {
        item.addEventListener('click', () => {
            const animeId = item.getAttribute('data-id');
            window.location.href = `anime.html?id=${animeId}`;
        });
    });
}

// Filter animes based on search input
function filterAnimes() {
    const query = searchInput.value.toLowerCase();
    fetch('http://localhost:3000/animes')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(animes => {
            const filteredAnimes = animes.filter(anime => anime.title.toLowerCase().includes(query));
            if (filteredAnimes.length === 0) {
                animeList.innerHTML = '<li>No results found.</li>';
            } else {
                displayAnimes(filteredAnimes);
            }
        })
        .catch(error => console.error('Fetch error:', error));
}

// Show underrated animes
function showUnderratedAnimes() {
    fetch('http://localhost:3000/animes')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(animes => {
            const underratedAnimes = animes.filter(anime => parseFloat(anime.rating) < 8.0);
            if (underratedAnimes.length === 0) {
                animeList.innerHTML = '<li>No underrated animes found.</li>';
            } else {
                displayAnimes(underratedAnimes);
            }
        })
        .catch(error => console.error('Fetch error:', error));
}

// Toggle dark/light mode
function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    const header = document.querySelector('header');
    header.classList.toggle('light-header', !darkMode);
}

// Event Listeners
searchInput.addEventListener('input', filterAnimes);
searchButton.addEventListener('click', filterAnimes);
toggleThemeButton.addEventListener('click', toggleTheme);
underratedButton.addEventListener('click', showUnderratedAnimes);

// Initial fetch on page load
fetchAnimes();
