const searchInput = document.getElementById("searchInput");
const main = document.querySelector("main");

// Pencet Enter juga jalan
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMusic();
});

// Fungsi cari musik
async function searchMusic() {
  const query = searchInput.value.trim();

  if (!query) {
    Swal.fire("Masukkan kata kunci terlebih dahulu!");
    return;
  }

  // Tampilkan loading dengan SweetAlert2
  Swal.fire({
    title: 'Sedang mencari...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`);
    const data = await res.json();

    // Tutup loading popup
    Swal.close();

    if (!data.results || data.results.length === 0) {
      main.innerHTML = "<p class='info'>Tidak ada hasil ditemukan.</p>";
      return;
    }

    main.innerHTML = ""; // kosongkan hasil lama

    data.results.forEach(track => {
      // URL pencarian Spotify
      const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(track.trackName + ' ' + track.artistName)}`;

      main.innerHTML += `
        <div class="music-card">
          <img src="${track.artworkUrl100}" alt="${track.trackName}" class="cover">
          <div class="music-info">
            <h2>${track.trackName}</h2>
            <p>${track.artistName}</p>
            <div class="button-group">
              <a href="${track.trackViewUrl}" target="_blank" class="icon-btn" title="Play di iTunes">
                <i class="fas fa-music"></i>
              </a>
              <a href="${spotifySearchUrl}" target="_blank" class="icon-btn spotify-btn" title="Cari di Spotify">
                <i class="fab fa-spotify"></i>
              </a>
              ${track.previewUrl ? `
                <button class="icon-btn" onclick="playPreview('${track.previewUrl}', this)" title="Play Preview">
                  <i class="fas fa-play-circle"></i>
                </button>
                <button class="icon-btn" onclick="pausePreview()" title="Pause Preview">
                  <i class="fas fa-pause-circle"></i>
                </button>
              ` : "<p><i>Preview tidak tersedia</i></p>"}
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    Swal.close();
    main.innerHTML = "<p class='info'>Terjadi kesalahan saat mencari musik.</p>";
  }
}

let currentAudio = null;

function playPreview(url, button) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentAudio = new Audio(url);
  currentAudio.play();
}

function pausePreview() {
  if (currentAudio) {
    currentAudio.pause();
  }
}