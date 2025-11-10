import ApiSource from '../../data/api.js';
import DetailPresenter from './detail-presenter.js';
import UrlParser from '../../routes/url-parser.js';
import BookmarkIdb from '../../data/bookmark-idb.js';
// Ini adalah View
const DetailPage = {
  async render() {
    // 1. Render kerangka (shell) dengan loading indicator
    return `
      <section id="detail-content" class="max-w-4xl mx-auto p-4">
        <div class="loading-indicator text-center text-white text-xl p-8">
          Memuat cerita...
        </div>
      </section>
      <div id="bookmark-button-container" class="fixed bottom-8 right-8 z-40">
        </div>
    `;
  },

  async afterRender() {
    // 2. Ambil ID dari URL
    console.log('DetailPage.afterRender() dipanggil');
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const storyId = url.id;

    console.log('Raw URL Parser Result:', url);
    console.log('Story ID dari parser:', storyId);

    const token = sessionStorage.getItem('loginToken');

    // 3. Inisialisasi Presenter
    new DetailPresenter({
      view: this,
      model: ApiSource,
      idbModel: BookmarkIdb,
      storyId: storyId,
      token: token,
    });
  },

  // === Fungsi yang dipanggil oleh Presenter ===

  showStory(story) {
    console.log('DetailPage.showStory() dipanggil');
    const container = document.getElementById('detail-content');
    if (!container) {
      console.error('FATAL: #detail-content TIDAK DITEMUKAN'); // <-- TAMBAH
      return;
    }

    // Format tanggal
    const formattedDate = new Date(story.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 4. Render konten lengkap (dengan Tailwind)
    container.innerHTML = `
      <article class="bg-white shadow-xl rounded-lg overflow-hidden">
        <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" class="w-full h-96 object-cover">
        
        <div class="p-6 md:p-8">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${story.name}</h2>
          <p class="text-gray-500 text-base mb-6">
            Di-upload pada: ${formattedDate}
          </p>
          
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Deskripsi:</h3>
          <p class="text-gray-700 text-lg leading-relaxed">
            ${story.description}
          </p>
          
          ${story.lat && story.lon ? `
            <div class="mt-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Lokasi:</h3>
              <p class="text-gray-600">Lat: ${story.lat}, Lon: ${story.lon}</p>
              </div>
          ` : ''}
          
        </div>
      </article>
    `;
  },

  showError(message) {
    const container = document.getElementById('detail-content');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong class="font-bold">Gagal memuat cerita:</strong>
          <span class="block sm:inline">${message}</span>
        </div>
      `;
    }
  },
  renderBookmarkButton(isBookmarked) {
    const container = document.getElementById('bookmark-button-container');
    if (isBookmarked) {
      // Tampilkan tombol "Bookmarked" (Solid)
      container.innerHTML = `
        <button id="bookmark-button" class="p-4 bg-blue-600 text-white rounded-full shadow-lg" title="Hapus dari Bookmark">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.125L5 18V4z"></path></svg>
        </button>
      `;
    } else {
      // Tampilkan tombol "Bookmark" (Outline)
      container.innerHTML = `
        <button id="bookmark-button" class="p-4 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-100" title="Simpan ke Bookmark">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        </button>
      `;
    }
  },
  setBookmarkClickListener(callback) {
    const container = document.getElementById('bookmark-button-container');
    container.addEventListener('click', (event) => {
      const button = event.target.closest('#bookmark-button');
      if (button) {
        callback();
      }
    });
  },
};
export default DetailPage;