class AddDataPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._view.setSubmitListener(() => this._submitHandler());
  }

  async _submitHandler() {
    try {
      this._view.hideError();
      this._view.showLoading();

      const token = sessionStorage.getItem('loginToken');
      if (!token) {
        throw new Error('Anda harus login untuk menambah data.');
      }

      const { description, photo, lat: latString, lon: lonString } = this._view.getInput();

      const lat = parseFloat(latString);
      const lon = parseFloat(lonString);

      if (!description || !photo || isNaN(lat) || isNaN(lon)) {
        throw new Error('Semua field wajib diisi (Deskripsi, Foto, dan Lokasi Peta).');
      }

      await this._model.addNewStory({ description, photo, lat, lon, token });
      this._view.showSuccess('Cerita baru berhasil di-upload (Online)!');
      this._view.redirectToHome();

    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('offline')) {
        console.warn('Upload online gagal (OFFLINE), menyimpan ke Outbox...');
        try {
          const { description, photo, lat: latString, lon: lonString } = this._view.getInput();

          await IdbHelper.putStoryToOutbox({
            description,
            photo,
            lat: parseFloat(latString),
            lon: parseFloat(lonString),
          });

          this._view.showSuccess('Koneksi terputus. Cerita disimpan di Outbox!');
          this._view.redirectToHome();

        } catch (idbError) {
          this._view.showError(`Gagal menyimpan ke Outbox: ${idbError.message}`);
        }
      } else {
        console.error('Upload online gagal (ONLINE):', error.message);
        this._view.showError(`Upload gagal: ${error.message}`);
      }

    } finally {
      this._view.hideLoading();
    }
  }
}

export default AddDataPresenter;