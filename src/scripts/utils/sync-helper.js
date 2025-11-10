import ApiSource from '../data/api.js';
import IdbHelper from '../data/idb-helper.js';

const SyncHelper = {
    async syncOutbox() {
        console.log('Mencoba sinkronisasi Outbox...');

        const token = sessionStorage.getItem('loginToken');
        if (!token) {
            console.warn('Sinkronisasi dibatalkan: Pengguna belum login.');
            return;
        }

        const storiesInAwaiting = await IdbHelper.getAllStoriesFromOutbox();

        if (storiesInAwaiting.length === 0) {
            console.log('Outbox kosong. Tidak ada yang perlu disinkronisasi.');
            return;
        }

        console.log(`Ditemukan ${storiesInAwaiting.length} item di Outbox. Memulai pengiriman...`);

        for (const story of storiesInAwaiting) {
            try {
                const { description, photo, lat: latFromDb, lon: lonFromDb, id: idbId } = story;

                console.log(`Mengirim cerita ID: ${idbId}...`);

                await ApiSource.addNewStory({
                    description,
                    photo,
                    lat: parseFloat(latFromDb), 
                    lon: parseFloat(lonFromDb), 
                    token,
                });

                console.log(`Cerita ID: ${idbId} berhasil di-upload.`);
                await IdbHelper.deleteStoryFromOutbox(idbId);

            } catch (error) {
                console.error(`Gagal mengirim cerita ID: ${story.id}. Menghentikan sinkronisasi.`, error.message);
                break;
            }
        }

        console.log('Sinkronisasi Outbox selesai.');
    },
};

export default SyncHelper;