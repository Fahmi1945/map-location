import CONFIG from '../config.js';

class ApiSource {
  static async getAllStories(token) {
    try {
      // 2. PASTIKAN FETCH ANDA MEMILIKI 'headers'
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  static async register({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      // Jika sukses, kembalikan pesan
      return responseJson;

    } catch (error) {
      console.error('Gagal register:', error);
      throw error; // Lempar error agar ditangkap Presenter
    }
  }
  static async getStoryById(id, token) {
    try {
      const activeToken = token ? token : CONFIG.GUEST_TOKEN;

      const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
        },
      });

      // ✅ CEK STATUS RESPONSE LEBIH DULU
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const responseJson = await response.json();

      // ✅ CEK STRUKTUR RESPONSE
      if (responseJson.error) {
        throw new Error(responseJson.message || 'Unknown error from API');
      }

      if (!responseJson.story) {
        throw new Error('Format data tidak sesuai: property "story" tidak ditemukan dalam response');
      }

      console.log('Story berhasil diambil:', responseJson.story);
      return responseJson.story;

    } catch (error) {
      console.error(`Gagal mengambil detail cerita: ${error.message}`);
      throw error;
    }
  }
}

export default ApiSource;

