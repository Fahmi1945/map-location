class DetailPresenter {
    constructor({ view, model, storyId, token, idbModel }) {
        this._view = view;
        this._model = model;
        this._idbModel = idbModel;
        this._storyId = storyId;
        this._token = token;

        this._story = null;
        this._isBookmarked = false;

        this._loadStory();
        this._view.setBookmarkClickListener(() => this._handleBookmarkClick());
    }

    async _loadStory() {
        console.log('DetailPresenter._loadStory() mulai');
        console.log('StoryId:', this._storyId);
        console.log('Token:', this._token ? 'Ada' : 'Tidak ada');

        try {
            const story = await this._model.getStoryById(this._storyId, this._token);
            console.log('Data cerita diterima:', story);
            this._story = story;
            this._view.showStory(story);

            await this._checkBookmarkStatus();
        } catch (error) {
            console.error('Gagal di _loadStory:', error);
            this._view.showError(error.message);
        }
    }
    async _checkBookmarkStatus() {
        const storyInIdb = await this._idbModel.getStory(this._storyId);
        this._isBookmarked = !!storyInIdb;  
        console.log('Bookmark status:', this._isBookmarked);
        this._view.renderBookmarkButton(this._isBookmarked);
    }

    async _handleBookmarkClick() {
        console.log('Bookmark button diklik');
        console.log('this._story:', this._story);
        if (this._isBookmarked) {

            await this._idbModel.deleteStory(this._storyId);
            console.log('Cerita dihapus dari bookmark.');
        } else {

            if (this._story) {
                await this._idbModel.putStory(this._story);
                console.log('Cerita disimpan ke bookmark.');
            } else {
                console.error('Tidak ada cerita untuk disimpan ke bookmark.');
                return;
            }
        }
        await this._checkBookmarkStatus();
    }
}

export default DetailPresenter;