class HomePresenter {
    // PERBAIKAN 1: Terima 'view' dan 'model' sebagai object
    constructor({ view, model }) {
        this._view = view;
        this._model = model;

        this._init();
    }

    async _init() {
        try {
            const token = sessionStorage.getItem('loginToken');

            // 2. Jika tidak ada token, jangan panggil API
            if (!token) {
                this._view.showLoginMessage(); // Panggil fungsi View baru
                this._view.hideLoading(); // Sembunyikan loading
                return;
            }

            // 3. Jika ada token, ambil data
            const stories = await this._model.getAllStories(token);
            this._view.showStories(stories);
        } catch (error) {
            this._view.showError(error.message);
        } finally {
            // Panggilan ini sekarang akan BEKERJA
            this._view.hideLoading();
        }
    }
}

export default HomePresenter;