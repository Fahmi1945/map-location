import 'regenerator-runtime'; // Untuk async/await
import '../styles/styles.css'; // Import CSS
import App from './pages/app.js';
import SyncHelper from './utils/sync-helper.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker berhasil didaftarkan:', registration);
      })
      .catch(error => {
        console.error('Pendaftaran Service Worker gagal:', error);
      });
  });
}

// MENUNGGU HTML SIAP TERLEBIH DAHULU
document.addEventListener('DOMContentLoaded', () => {
  // Pindahkan kode inisialisasi App ke DALAM listener ini
  const app = new App({
    content: document.querySelector('#main-content'),
  });
  app.start();
  SyncHelper.syncOutbox();
});
window.addEventListener('online', () => {
  console.log('Koneksi kembali online! Mencoba sinkronisasi...');
  SyncHelper.syncOutbox();
});