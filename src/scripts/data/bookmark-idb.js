import { openDB } from 'idb';
import CONFIG from '../config.js';

const DB_NAME = 'petacerita-bookmark-db';
const STORE_NAME = 'bookmarked-stories';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Buat object store dengan 'id' (dari API) sebagai keyPath
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const BookmarkIdb = {
  /**
   * Mengambil 1 cerita dari IndexedDB
   * @param {string} id - ID Cerita
   */
  async getStory(id) {
    if (!id) return;
    return (await dbPromise).get(STORE_NAME, id);
  },
  
  /**
   * Mengambil SEMUA cerita dari IndexedDB
   */
  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },

  /**
   * Menyimpan/Bookmark cerita
   * @param {object} story - Objek cerita lengkap
   */
  async putStory(story) {
    // Pastikan 'story' adalah objek dan memiliki 'id'
    if (!story || !story.id) return;
    return (await dbPromise).put(STORE_NAME, story);
  },

  /**
   * Menghapus/Un-bookmark cerita
   * @param {string} id - ID Cerita
   */
  async deleteStory(id) {
    if (!id) return;
    return (await dbPromise).delete(STORE_NAME, id);
  },
};

export default BookmarkIdb;