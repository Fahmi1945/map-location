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
          'Authorization': `Bearer ${token}`,

        },
        body: formData,
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;

    } catch (error) {
      console.error('Gagal menambah cerita baru:', error);
      throw error;
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

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const responseJson = await response.json();

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
  /**
   * Mengirim data subscription ke server
   * @param {PushSubscription} subscription - Objek subscription dari browser
   * @param {string} token - Token login pengguna
   */
  stati
  static async subscribeToNotifications(subscription, token) {
    try {
      // ⬇️ --- PERBAIKAN DIMULAI DI SINI --- ⬇️

      // 1. Ubah PushSubscription menjadi objek JSON standar
      const subscriptionJson = subscription.toJSON();

      // 2. Buat payload BARU yang hanya berisi apa yang dibutuhkan server
      //    Kita membuang 'expirationTime'
      const bodyPayload = {
        endpoint: subscriptionJson.endpoint,
        keys: subscriptionJson.keys,
      };

      // GANTI '/notifications/subscribe' DENGAN ENDPOINT YANG BENAR DARI DICODING
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // 3. Kirim payload yang sudah "dibersihkan"
        body: JSON.stringify(bodyPayload),
      });

      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson;

    } catch (error) {
      console.error('Gagal mengirim subscription ke server:', error.message);
      throw error;
    }
  }

  /**
   * Memberi tahu server untuk berhenti mengirim notifikasi
   * @param {string} subscriptionEndpoint - Endpoint unik dari obj subscription
   * @param {string} token - Token login pengguna
   */
  static async unsubscribeFromNotifications(subscriptionEndpoint, token) {
    try {
      // GANTI '/notifications/unsubscribe' DENGAN ENDPOINT YANG BENAR DARI DICODING
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint: subscriptionEndpoint }),
      });

      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      return responseJson;

    } catch (error) {
      console.error('Gagal mengirim unsubscribe ke server:', error.message);
      throw error;
    }
  }
}

export default ApiSource;

