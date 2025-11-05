// Lokasi: src/scripts/pages/register/register-presenter.js

class RegisterPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._view.setSubmitListener(() => this._registerHandler());
  }

  async _registerHandler() {
    try {
      this._view.hideError();
      this._view.showLoading();

      const { name, email, password } = this._view.getInput();

      // Validasi sederhana (Dicoding API juga akan memvalidasi)
      if (!name || !email || !password) {
        throw new Error('Semua field wajib diisi.');
      }
      if (password.length < 8) {
        throw new Error('Password minimal 8 karakter.');
      }

      const result = await this._model.register({ name, email, password });

      this._view.showSuccess(`${result.message}. Anda akan diarahkan ke halaman login.`);
      this._view.redirectToLogin();

    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default RegisterPresenter;