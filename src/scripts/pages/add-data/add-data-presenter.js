// Lokasi: src/scripts/pages/add-data/add-data-presenter.js

class AddDataPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._view.setSubmitListener(() => this._submitHandler());
  }

  // Fungsi yang dipanggil saat form di-submit
  async _submitHandler() {
    try {
      this._view.hideError();
      this._view.showLoading();

      // 1. Ambil Login Token dari Session Storage
      const token = sessionStorage.getItem('loginToken');
      if (!token) {
        throw new Error('Anda harus login untuk menambah data.');
      }

      // 2. Ambil data input dari View
      const { description, photo, lat, lon } = this._view.getInput();

      // 3. Validasi Input (Kriteria 3)
      if (!description || !photo || !lat || !lon) {
        throw new Error('Semua field wajib diisi (Deskripsi, Foto, dan Lokasi Peta).');
      }

      // 4. Kirim data ke Model (API)
      await this._model.addNewStory({ description, photo, lat, lon, token });

      // 5. Jika sukses, tampilkan pesan sukses
      this._view.showSuccess('Cerita baru berhasil ditambahkan!');
      
      // 6. Perintahkan View untuk pindah halaman
      this._view.redirectToHome();

    } catch (error) {
      // 7. Jika gagal, tampilkan error di View
      this._view.showError(error.message);
    } finally {
      // 8. Selalu sembunyikan loading
      this._view.hideLoading();
    }
  }
}

export default AddDataPresenter;