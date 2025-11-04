import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ApiSource from '../../data/api.js';
import AddDataPresenter from './add-data-presenter.js';

// Perbaikan icon Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl, iconRetinaUrl: iconRetinaUrl, shadowUrl: shadowUrl,
});

const AddDataPage = {
  async render() {
    return `
      <section class="add-data-page max-w-2xl mx-auto p-4">
        <div class="bg-white shadow-xl rounded-lg p-8">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Tambah Cerita Baru</h2>

          <form id="add-data-form">
          
            <div id="loading-indicator" class="hidden mb-4 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
              Mengupload...
            </div>
            <div id="error-message" class="hidden mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              </div>
            <div id="success-message" class="hidden mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
              </div>
          
            <div class="mb-6">
              <label for="description-input" class="block mb-2 text-sm font-medium text-gray-900">Deskripsi Cerita</label>
              <textarea id="description-input" name="description" rows="4" 
                        class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="Tulis deskripsi singkat..." required></textarea>
            </div>
            
            <div class="mb-6">
              <label for="photo-input" class="block mb-2 text-sm font-medium text-gray-900">Upload Gambar (Wajib)</label>
              <input type="file" id="photo-input" name="photo" accept="image/*" required
                     class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
                            cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 
                            file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            </div>
            
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-900">Pilih Lokasi dari Peta (Wajib Klik)</label>
              <div id="map-add" class="map-container-add"></div>
              <input type="hidden" id="lat-input" name="lat" required>
              <input type="hidden" id="lon-input" name="lon" required>
            </div>
            
            <button type="submit" id="submit-button" 
                    class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none 
                           focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center 
                           disabled:bg-gray-400 disabled:cursor-not-allowed">
              Upload Cerita
            </button>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    console.log('AddDataPage.afterRender() dipanggil');
    this._map = null;
    this._marker = null;
    this._initMap();
    new AddDataPresenter({
      view: this,
      model: ApiSource,
    });
  },

  // === Fungsi View (tetap sama, hanya targetnya beda) ===
  _initMap() {
    const centerLat = -6.200000;
    const centerLon = 106.816666;
    this._map = L.map('map-add').setView([centerLat, centerLon], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    this._map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat-input').value = lat;
      document.getElementById('lon-input').value = lng;
      if (this._marker) {
        this._map.removeLayer(this._marker);
      }
      this._marker = L.marker([lat, lng]).addTo(this._map);
    });
  },
  getInput() {
    const description = document.getElementById('description-input').value;
    const photo = document.getElementById('photo-input').files[0];
    const lat = document.getElementById('lat-input').value;
    const lon = document.getElementById('lon-input').value;
    return { description, photo, lat, lon };
  },
  setSubmitListener(callback) {
    const form = document.getElementById('add-data-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      callback();
    });
  },
  showLoading() {
    document.getElementById('loading-indicator').style.display = 'block';
    document.getElementById('submit-button').disabled = true;
  },
  hideLoading() {
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('submit-button').disabled = false;
  },
  showError(message) {
    document.getElementById('error-message').innerHTML = message;
    document.getElementById('error-message').style.display = 'block';
  },
  hideError() {
    document.getElementById('error-message').style.display = 'none';
  },
  showSuccess(message) {
    document.getElementById('success-message').innerHTML = message;
    document.getElementById('success-message').style.display = 'block';
  },
  redirectToHome() {
    console.log('Tambah data berhasil, mengarahkan ke Home...');
    setTimeout(() => {
      window.location.hash = '#/home';
    }, 2000);
  },
};

export default AddDataPage;