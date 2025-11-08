import { openDB } from 'idb';

// Nama database dan object store
const DB_NAME = 'petacerita-db';
const STORE_NAME = 'story-outbox'; // "Kotak Keluar" untuk cerita offline
const DB_VERSION = 1;

// Inisialisasi database
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Buat object store jika belum ada
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      // Buat 'id' sebagai auto-incrementing key
      db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
    }
  },
});

const IdbHelper = {
  /**
   * Mengambil semua data dari "kotak keluar"
   */
  async getAllStoriesFromOutbox() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  /**
   * Menambah cerita ke "kotak keluar"
   * @param {object} story - Objek cerita (deskripsi, foto, lat, lon)
   */
  async putStoryToOutbox(story) {
    const db = await dbPromise;
    // Kita tambahkan 'timestamp' agar bisa diurutkan
    story.timestamp = new Date().getTime();
    return db.put(STORE_NAME, story);
  },

  /**
   * Menghapus cerita dari "kotak keluar" berdasarkan ID
   * @param {number} id - ID auto-increment dari IndexedDB
   */
  async deleteStoryFromOutbox(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },
};

export default IdbHelper;