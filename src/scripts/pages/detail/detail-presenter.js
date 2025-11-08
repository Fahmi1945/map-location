class DetailPresenter {
    constructor({ view, model, storyId, token }) {  // ✅ TAMBAH token parameter
        this._view = view;
        this._model = model;
        this._storyId = storyId;
        this._token = token;  // ✅ Sekarang token akan terdefinisi

        // CUKUP PANGGIL SATU KALI
        this._loadStory();
    }

    async _loadStory() {
        console.log('DetailPresenter._loadStory() mulai');
        console.log('StoryId:', this._storyId);  // ✅ DEBUG
        console.log('Token:', this._token ? 'Ada' : 'Tidak ada');  // ✅ DEBUG
        
        try {
            const story = await this._model.getStoryById(this._storyId, this._token);
            console.log('Data cerita diterima:', story);
            this._view.showStory(story);
        } catch (error) {
            console.error('Gagal di _loadStory:', error);
            this._view.showError(error.message);
        }
    }
}

export default DetailPresenter;