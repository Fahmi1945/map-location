import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

class App {
  constructor({ content }) {
    this._content = content;
    
    // Inisialisasi logika UI (Navbar, Logout, dll)
    this._checkAuthStatus();
    this._initLogoutButtons();
    this._initMobileMenuButton(); // 1. TAMBAHKAN INI
  }

  // 2. TAMBAHKAN FUNGSI BARU INI
  _initMobileMenuButton() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const icons = mobileMenuButton.querySelectorAll('svg');
    
    mobileMenuButton.addEventListener('click', () => {
      // Toggle (ganti) class 'hidden' pada menu
      mobileMenu.classList.toggle('hidden');
      
      // Ganti ikon hamburger/X
      icons.forEach(icon => icon.classList.toggle('hidden'));
    });
  }

  _checkAuthStatus() {
    const token = sessionStorage.getItem('loginToken');
    const userName = sessionStorage.getItem('userName');

    // Ambil SEMUA elemen navigasi (Desktop & Mobile)
    const guestNavs = document.querySelectorAll('#guest-nav, #guest-nav-mobile');
    const userNavs = document.querySelectorAll('#user-nav, #user-nav-mobile');
    const userNameDisplays = document.querySelectorAll('#user-name-display, #user-name-display-mobile');

    if (token && userName) {
      // Jika login, tampilkan navigasi user, sembunyikan guest
      guestNavs.forEach(nav => nav.style.display = 'none');
      userNavs.forEach(nav => nav.style.display = 'flex'); // 'flex' untuk desktop, 'block' untuk mobile
      // Sesuaikan display untuk mobile
      document.getElementById('user-nav-mobile').style.display = 'block';

      userNameDisplays.forEach(display => display.textContent = userName);
    } else {
      // Jika guest, tampilkan navigasi guest, sembunyikan user
      guestNavs.forEach(nav => nav.style.display = 'flex');
      // Sesuaikan display untuk mobile
      document.getElementById('guest-nav-mobile').style.display = 'block';
      
      userNavs.forEach(nav => nav.style.display = 'none');
    }
  }

  _initLogoutButtons() {
    // Ambil KEDUA tombol logout
    const logoutButtons = document.querySelectorAll('#logout-button, #logout-button-mobile');
    
    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        sessionStorage.removeItem('loginToken');
        sessionStorage.removeItem('userName');
        
        this._checkAuthStatus(); // Update UI Navbar
        window.location.hash = '#/login'; // Redirect ke login
      });
    });
  }

  async _renderPage() {
    // Transisi Halaman (Kriteria 1)
    // 1. Tambahkan kelas fade-out
    this._content.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    
    // 2. Tunggu animasi selesai
    await new Promise(resolve => setTimeout(resolve, 300)); 

    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url] ? routes[url] : routes['/'];
    
    // 3. Ganti konten HTML
    this._content.innerHTML = await page.render();
    
    // 4. Hapus kelas fade-out (memicu fade-in)
    // Kita gunakan requestAnimationFrame untuk memastikan 'render' selesai
    requestAnimationFrame(() => {
      this._content.classList.remove('opacity-0');
    });

    if (page.afterRender) {
      await page.afterRender();
    }
    
    // Setiap pindah halaman, cek status login lagi
    // (PENTING: untuk update UI setelah redirect dari Login/Add Data)
    this._checkAuthStatus();
    
    // Setiap pindah halaman, tutup menu mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const icons = mobileMenuButton.querySelectorAll('svg');

    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      // Reset ikon hamburger
      icons[0].classList.remove('hidden'); // Tampilkan hamburger
      icons[1].classList.add('hidden'); // Sembunyikan 'X'
    }
  }

  start() {
    document.addEventListener('DOMContentLoaded', () => {
      this._renderPage();
    });
    window.addEventListener('hashchange', () => {
      this._renderPage();
    });
  }
}

export default App;