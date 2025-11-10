import BookmarkIdb from '../../data/bookmark-idb.js';

const BookmarkPage = {
    async render() {
        return `
      <section class="bookmark-page px-4">
        <h2 class="text-3xl font-bold text-white my-8 text-center">Cerita Tersimpan (Bookmarks)</h2>
        
        <div class="max-w-md mx-auto mb-8">
          <label for="search-bookmark" class="sr-only">Cari Bookmark</label>
          <input type="search" id="search-bookmark" 
                 placeholder="Cari berdasarkan judul..."
                 class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
          >
        </div>
        <div id="bookmark-list-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          </div>
      </section>
    `;
    },

    async afterRender() {
        // 1. Simpan referensi cerita
        this._stories = await BookmarkIdb.getAllStories();
        this._container = document.getElementById('bookmark-list-container');

        // 2. Render list awal
        this._renderBookmarkList(this._stories);

        // 3. ⬇️ --- TAMBAHKAN LOGIKA SEARCH (Kriteria 4 Skilled) --- ⬇️
        const searchInput = document.getElementById('search-bookmark');
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this._filterBookmarks(query);
        });
        // ⬆️ --- SELESAI PENAMBAHAN --- ⬆️

        // 4. Tambahkan listener untuk tombol hapus
        this._container.addEventListener('click', (event) => this._handleDeleteButton(event));
    },

    /**
     * (Kriteria 4 Skilled)
     * Fungsi baru untuk mem-filter dan me-render ulang list
     */
    _filterBookmarks(query) {
        const filteredStories = this._stories.filter(story =>
            story.name.toLowerCase().includes(query)
        );
        this._renderBookmarkList(filteredStories);
    },

    /**
     * (Refactor)
     * Logika untuk me-render list cerita ke DOM
     */
    _renderBookmarkList(stories) {
        this._container.innerHTML = ''; // Kosongkan list

        if (stories.length === 0) {
            this._container.innerHTML = `
        <p class="col-span-full text-center text-gray-300 text-xl">
          Tidak ada cerita yang cocok ditemukan.
        </p>
      `;
            return;
        }

        stories.forEach((story) => {
            this._container.innerHTML += this._createStoryItemTemplate(story);
        });
    },

    /**
     * (Kriteria 4: Delete)
     * Menangani klik pada tombol hapus
     */
    async _handleDeleteButton(event) {
        const deleteButton = event.target.closest('.delete-bookmark-button');
        if (deleteButton) {
            const storyId = deleteButton.dataset.id;

            // Hapus dari IndexedDB
            await BookmarkIdb.deleteStory(storyId);

            // Hapus dari daftar lokal (this._stories)
            this._stories = this._stories.filter(story => story.id !== storyId);

            // Render ulang list (dengan data yang sudah di-filter)
            const query = document.getElementById('search-bookmark').value.toLowerCase();
            this._filterBookmarks(query);
        }
    },

    /**
     * (Template)
     * Membuat template HTML untuk satu card bookmark
     */
    _createStoryItemTemplate(story) {
        const formattedDate = new Date(story.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });

        return `
      <article class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src="${story.photoUrl}" alt="${story.name}" class="w-full h-56 object-cover">
        <div class="p-5 relative">
          <h3 class="font-bold text-2xl mb-2 text-gray-900">
            <a href="#/detail/${story.id}" class="hover:underline">${story.name}</a>
          </h3>
          <p class="text-gray-500 text-sm mb-3 font-medium">${formattedDate}</p>
          <p class="text-gray-700 text-base">${story.description.substring(0, 100)}...</p>
          
          <button 
            data-id="${story.id}"
            title="Hapus bookmark"
            class="delete-bookmark-button absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
      </article>
    `;
    },
};

export default BookmarkPage;