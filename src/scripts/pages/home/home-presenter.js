class HomePresenter {
    // PERBAIKAN 1: Terima 'view' dan 'model' sebagai object
    constructor({ view, model }) { 
        this._view = view;
        this._model = model;

        this._init();
    }

    async _init() {
        try {
            this._view.showLoading();
            const stories = await this._model.getAllStories();
            
            // PERBAIKAN 2: Hapus panggilan ke 'showMapMarkers'
            // 'showStories' sudah menangani list DAN marker
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