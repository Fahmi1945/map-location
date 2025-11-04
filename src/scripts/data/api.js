// 1. PASTIKAN ANDA MENG-IMPORT CONFIG
import CONFIG from '../config.js';

class ApiSource {
  static async getAllStories() {
    try {
      // 2. PASTIKAN FETCH ANDA MEMILIKI 'headers'
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'GET',
        headers: {
          // 3. INI BARIS PALING KRUSIAL
          'Authorization': `Bearer ${CONFIG.GUEST_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      if (responseJson.listStory) {
        return responseJson.listStory;
      } else {
        throw new Error('Format data tidak sesuai: listStory tidak ditemukan');
      }

    } catch (error) {
      console.error('Gagal mengambil data dari API:', error);
      throw error;
    }
  }
  static async login({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        // Jika API mengembalikan pesan error (misal: password salah)
        throw new Error(responseJson.message);
      }

      // Jika sukses, kembalikan data user (termasuk token)
      return responseJson.loginResult;

    } catch (error) {
      console.error('Gagal login:', error);
      throw error; // Lempar error agar ditangkap Presenter
    }
  }
  static async addNewStory({ description, photo, lat, lon, token }) {
    // 1. Buat FormData karena kita akan kirim file
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo); // 'photo' adalah file gambar
    formData.append('lat', lat);
    formData.append('lon', lon);

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          // 2. Gunakan Login Token untuk otorisasi
          'Authorization': `Bearer ${token}`,
          // 3. 'Content-Type' TIDAK PERLU di-set, 
          //    browser akan otomatis mengaturnya (termasuk 'boundary') 
          //    saat menggunakan FormData.
        },
        body: formData, // 4. Kirim formData sebagai body
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      // Jika sukses, API akan mengembalikan pesan sukses
      return responseJson;

    } catch (error) {
      console.error('Gagal menambah cerita baru:', error);
      throw error; // Lempar error agar ditangkap Presenter
    }
  }

  // ... (fungsi lain nanti) ...
}

export default ApiSource;

