// 1. Import Library
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// 2. Import Presenter & Model
import HomePresenter from './home-presenter.js';
import ApiSource from '../../data/api.js';

// 3. Perbaikan Ikon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
});

// 5. Definisikan View (dengan Tailwind)
const HomePage = {
  async render() {
    return `
      <section class="home-page px-4">
        <!-- PERUBAHAN: Ubah text-gray-900 menjadi text-white -->
        <h2 class="text-3xl font-bold text-white my-6 text-center">Peta Lokasi Cerita</h2>
        
        <div id="map" class="map-container shadow-lg rounded-lg"></div>
        
        <!-- PERUBAHAN: Ubah text-gray-900 menjadi text-white -->
        <h2 class="text-3xl font-bold text-white my-8 text-center">Daftar Cerita</h2>
        
        <div id="data-list-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <p class="loading-indicator col-span-full text-center text-gray-300 text-xl">
            Memuat data...
          </p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    console.log('HomePage.afterRender() dipanggil');
    this._map = null;
    this._markers = {};

    new HomePresenter({
      view: this,
      model: ApiSource,
    });
    this._addListClickHandlers();
  },

  // === Fungsi yang Dipanggil oleh Presenter ===

  _initializeMap() {
    if (this._map) return;
    const centerLat = -2.5489;
    const centerLon = 118.0149;
    this._map = L.map('map').setView([centerLat, centerLon], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);
    this._markers = {};
  },

  showLoading() {
    const listContainer = document.querySelector('#data-list-container');
    if (listContainer) {
      listContainer.innerHTML = `
        <p class="loading-indicator col-span-full text-center text-gray-600 text-xl">
          Memuat data...
        </p>`;
    }
  },

  // PERBAIKAN 3: Nama fungsi diubah dari '_hideLoading' menjadi 'hideLoading'
  hideLoading() {
    const listContainer = document.querySelector('#data-list-container');
    if (listContainer) {
      const loadingIndicator = listContainer.querySelector('.loading-indicator');
      if (loadingIndicator) {
        // Ganti loading dengan string kosong, agar grid siap diisi
        listContainer.innerHTML = '';
      }
    }
  },

  showError(message) {
    const listContainer = document.querySelector('#data-list-container');
    if (listContainer) {
      listContainer.innerHTML = `
        <div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong class="font-bold">Gagal memuat data:</strong>
          <span class="block sm:inline">${message}</span>
        </div>`;
    }
  },

  showStories(stories) {
    this._initializeMap();
    const listContainer = document.querySelector('#data-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = ''; // Kosongkan (hapus "Memuat data...")

    if (stories.length === 0) {
      listContainer.innerHTML = '<p class="col-span-full text-center text-gray-600">Tidak ada cerita untuk ditampilkan.</p>';
      return;
    }

    stories.forEach(story => {
      if (story.lat && story.lon) {
        // --- BUAT LIST ITEM (dengan Tailwind) ---
        // (Kriteria 4: Semantik <article>)
        const storyItem = document.createElement('article');
        storyItem.className = `story-item bg-white rounded-lg shadow-lg overflow-hidden 
                               transition-all duration-300 ease-in-out hover:shadow-xl cursor-pointer`;

        storyItem.dataset.id = story.id;
        storyItem.dataset.lat = story.lat;
        storyItem.dataset.lon = story.lon;

        const formattedDate = new Date(story.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="Cerita dari ${story.name}" class="w-full h-56 object-cover">
        <div class="p-5">
          <h3 class="font-bold text-2xl mb-2 text-gray-900">
            <span class="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
              ${story.name}
            </span>
          </h3>
          <p class="text-gray-500 text-sm mb-3 font-medium">${formattedDate}</p>
          <p class="text-gray-700 text-base">${story.description.substring(0, 100)}...</p>
        </div>
        `;
        listContainer.appendChild(storyItem);

        // --- BUAT MARKER PETA ---
        const popupContent = `<b>${story.name}</b><br>${story.description.substring(0, 50)}...`;
        const marker = L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(popupContent);
        this._markers[story.id] = marker;
      }
    });


  },

  _addListClickHandlers() {
    const listContainer = document.querySelector('#data-list-container');
    listContainer.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('.story-item');
      if (clickedItem) {
        const id = clickedItem.dataset.id;
        window.location.hash = `#/detail/${id}`;
      }
    });
  },


  _focusMapToMarker(id, lat, lon) {
    // Hapus highlight (Tailwind classes) dari semua item
    document.querySelectorAll('.story-item').forEach(item => {
      item.classList.remove('ring-4', 'ring-blue-500', 'scale-105', 'z-10');
    });

    // Tambahkan highlight (Tailwind classes) ke item yang diklik
    const activeItem = document.querySelector(`.story-item[data-id="${id}"]`);
    if (activeItem) {
      activeItem.classList.add('ring-4', 'ring-blue-500', 'scale-105', 'z-10');
      // Scroll ke item (opsional)
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Fokus peta
    if (this._map && this._markers[id]) {
      this._map.flyTo([lat, lon], 13);
      this._markers[id].openPopup();
    }
  },
};

export default HomePage;