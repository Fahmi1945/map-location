// Import 'View' dari setiap halaman
// Kita akan buat file-file ini di langkah 3
import HomePage from '../pages/home/home-page.js';
import AddDataPage from '../pages/add-data/add-data-page.js';
import LoginPage from '../pages/login/login-page.js';
// (Nanti Anda juga akan import Presenter-nya di sini jika diperlukan oleh app.js)

const routes = {
  '/': HomePage,           // Hash default
  '/home': HomePage,
  '/add-data': AddDataPage,
  '/login': LoginPage,
};

export default routes;