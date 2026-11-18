
// ==================================
// JELLYBLINK - BLACKPINK MUSIC APP
// ==================================

// DATA LAGU
const songs = [
    { title: "DDU-DU DDU-DU", artist: "BLACKPINK" },
    { title: "Kill This Love", artist: "BLACKPINK" },
    { title: "How You Like That", artist: "BLACKPINK" },
    { title: "Pink Venom", artist: "BLACKPINK" },
    { title: "Shut Down", artist: "BLACKPINK" },
    { title: "Lovesick Girls", artist: "BLACKPINK" },
    { title: "BOOMBAYAH", artist: "BLACKPINK" },
    { title: "As If It's Your Last", artist: "BLACKPINK" },
    { title: "Flower", artist: "JISOO" },
    { title: "Earthquake", artist: "JISOO" },
    { title: "Mantra", artist: "JENNIE" },
    { title: "Like JENNIE", artist: "JENNIE" },
    { title: "SOLO", artist: "JENNIE" },
    { title: "On The Ground", artist: "ROSÉ" },
    { title: "APT.", artist: "ROSÉ" },
    { title: "Gone", artist: "ROSÉ" },
    { title: "Money", artist: "LISA" },
    { title: "Rockstar", artist: "LISA" },
    { title: "New Woman", artist: "LISA" }
];

// MENGAMBIL DATA AKUN
function getUsers() {
    return JSON.parse(
        localStorage.getItem("jellyblinkUsers")
    ) || [];
}

// PESAN LOGIN DAN REGISTER
function message(text) {
    document.getElementById("authMessage").innerText = text;
}

// PINDAH LOGIN DAN REGISTER
function switchAuth() {
    document.getElementById("registerForm")
        .classList.toggle("hidden");

    document.getElementById("loginForm")
        .classList.toggle("hidden");

    message("");
}

// REGISTER
function register() {
    const username = document.getElementById("regUsername")
        .value.trim();

    const password = document.getElementById("regPassword")
        .value;

    if (!username || !password) {
        message("Semua kolom harus diisi!");
        return;
    }

    if (password.length < 6) {
        message("Password minimal 6 karakter!");
        return;
    }

    const users = getUsers();

    const existing = users.find(
        user => user.username.toLowerCase() === username.toLowerCase()
    );

    if (existing) {
        message("Username sudah digunakan!");
        return;
    }

    users.push({
        username: username,
        password: password
    });

    localStorage.setItem(
        "jellyblinkUsers",
        JSON.stringify(users)
    );

    document.getElementById("regUsername").value = "";
    document.getElementById("regPassword").value = "";

    message("Register berhasil! Silakan login.");

    setTimeout(function() {
        switchAuth();
    }, 1000);
}

// LOGIN
function login() {
    const username = document.getElementById("loginUsername")
        .value.trim();

    const password = document.getElementById("loginPassword")
        .value;

    const users = getUsers();

    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase()
        && u.password === password
    );

    if (!user) {
        message("Username atau password salah!");
        return;
    }

    localStorage.setItem(
        "jellyblinkCurrentUser",
        user.username
    );

    openApp(user.username);
}

// MEMBUKA APLIKASI
function openApp(username) {
    document.getElementById("authPage")
        .classList.add("hidden");

    document.getElementById("mainApp")
        .classList.remove("hidden");

    document.getElementById("profileName").innerText =
        username.substring(0, 2).toUpperCase();

    showAllSongs();
}

// LOGOUT
function logout() {
    localStorage.removeItem("jellyblinkCurrentUser");

    document.getElementById("mainApp")
        .classList.add("hidden");

    document.getElementById("authPage")
        .classList.remove("hidden");

    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";

    message("Kamu berhasil logout!");
}

// MENAMPILKAN DAFTAR LAGU
function renderSongs(list) {
    const songList = document.getElementById("songList");

    if (list.length === 0) {
        songList.innerHTML =
            "<p>Tidak ada lagu ditemukan.</p>";
        return;
    }

    songList.innerHTML = list.map((song, index) => `
        <div class="song">
            <span class="song-number">${index + 1}</span>

            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>

            <button class="play-btn"
                onclick="playSong(${songs.indexOf(song)})">
                ▶ Play
            </button>
        </div>
    `).join("");
}

// MENAMPILKAN SEMUA LAGU
function showAllSongs() {
    document.getElementById("songTitle").innerText =
        "Popular Songs";

    document.getElementById("searchInput").value = "";

    renderSongs(songs);
}

// FILTER BERDASARKAN ARTIS
function filterArtist(artist) {
    const filtered = songs.filter(
        song => song.artist === artist
    );

    document.getElementById("songTitle").innerText =
        artist + " Songs";

    document.getElementById("searchInput").value = "";

    renderSongs(filtered);

    document.getElementById("songs").scrollIntoView({
        behavior: "smooth"
    });
}

// FITUR PENCARIAN
function searchSongs() {
    const keyword = document.getElementById("searchInput")
        .value.toLowerCase();

    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword)
    );

    document.getElementById("songTitle").innerText =
        "Search Results";

    renderSongs(filtered);
}

// MEMBUKA LAGU DI SPOTIFY
function playSong(index) {
    const song = songs[index];

    const search = encodeURIComponent(
        song.title + " " + song.artist
    );

    window.open(
        "https://open.spotify.com/search/" + search,
        "_blank"
    );
}

// CEK SESI LOGIN
window.onload = function() {
    const currentUser = localStorage.getItem(
        "jellyblinkCurrentUser"
    );

    document.getElementById("mainApp")
        .classList.add("hidden");

    if (currentUser) {
        openApp(currentUser);
    } else {
        document.getElementById("authPage")
            .classList.remove("hidden");
    }
};
