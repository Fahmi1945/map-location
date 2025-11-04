import 'regenerator-runtime'; // Untuk async/await
import '../styles/styles.css'; // Import CSS
import App from './pages/app.js';

// MENUNGGU HTML SIAP TERLEBIH DAHULU
document.addEventListener('DOMContentLoaded', () => {
  // Pindahkan kode inisialisasi App ke DALAM listener ini
  const app = new App({
    content: document.querySelector('#main-content'), // Kirim 'wadah' <main> ke App
  });

  // Mulai aplikasi
  app.start();
});