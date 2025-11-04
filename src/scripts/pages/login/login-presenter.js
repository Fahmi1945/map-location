// Lokasi: src/scripts/pages/login/login-presenter.js

class LoginPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    // Pasang listener di View, dan beri tahu apa yang harus dilakukan
    // saat listener itu terpicu (yaitu panggil _loginHandler)
    this._view.setSubmitListener(() => this._loginHandler());
  }

  // Fungsi yang dipanggil saat form di-submit
  async _loginHandler() {
    try {
      this._view.hideError();
      this._view.showLoading();

      // 1. Ambil data input dari View
      const { email, password } = this._view.getInput();

      // 2. Kirim data ke Model (API)
      const loginResult = await this._model.login({ email, password });

      // 3. Jika sukses, simpan token ke Session Storage
      // Session Storage akan terhapus otomatis saat browser ditutup
      sessionStorage.setItem('loginToken', loginResult.token);
      sessionStorage.setItem('userName', loginResult.name);

      // 4. Perintahkan View untuk pindah halaman
      this._view.redirectToHome();

    } catch (error) {
      // 5. Jika gagal, tampilkan error di View
      this._view.showError(error.message);
    } finally {
      // 6. Selalu sembunyikan loading, baik sukses atau gagal
      this._view.hideLoading();
    }
  }
}

export default LoginPresenter;