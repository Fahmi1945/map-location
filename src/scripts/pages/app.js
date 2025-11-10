import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';
import PushNotificationHelper from '../utils/push-notification.js';

class App {
  constructor({ content }) {
    this._content = content;

    this._checkAuthStatus();
    this._initLogoutButtons();
    this._initMobileMenuButton(); 
  }

  _initMobileMenuButton() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const icons = mobileMenuButton.querySelectorAll('svg');

    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');

      icons.forEach(icon => icon.classList.toggle('hidden'));
    });
  }

  _checkAuthStatus() {
    console.log(sessionStorage.getItem('loginToken'));
    const token = sessionStorage.getItem('loginToken');
    const userName = sessionStorage.getItem('userName');

    const guestNavs = document.querySelectorAll('#guest-nav, #guest-nav-mobile');
    const userNavs = document.querySelectorAll('#user-nav, #user-nav-mobile');
    const userNameDisplays = document.querySelectorAll('#user-name-display, #user-name-display-mobile');

    if (token && userName) {
      guestNavs.forEach(nav => nav.style.display = 'none');
      userNavs.forEach(nav => nav.style.display = 'flex'); 
      document.getElementById('user-nav-mobile').style.display = 'block';

      userNameDisplays.forEach(display => display.textContent = userName);
      PushNotificationHelper.init({
        button: document.getElementById('notification-toggle-button'),
      });
    } else {
      guestNavs.forEach(nav => nav.style.display = 'flex');
      document.getElementById('guest-nav-mobile').style.display = 'block';

      userNavs.forEach(nav => nav.style.display = 'none');
    }
  }

  _initLogoutButtons() {
    const logoutButtons = document.querySelectorAll('#logout-button, #logout-button-mobile');

    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        sessionStorage.removeItem('loginToken');
        sessionStorage.removeItem('userName');

        this._checkAuthStatus();
        window.location.hash = '#/login';
      });
    });
  }

  async _renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    console.log('Mencoba mencocokkan rute:', url);
    const page = routes[url] ? routes[url] : routes['/'];
    console.log('Halaman yang di-render:', page.name);

    if (!document.startViewTransition) {
      this._content.innerHTML = await page.render();
      if (page.afterRender) {
        await page.afterRender();
      }

      this._checkAuthStatus();
      this._closeMobileMenu();
      return;
    }

    document.startViewTransition(async () => {
      this._content.innerHTML = await page.render();
      if (page.afterRender) {
        await page.afterRender();
      }
      this._checkAuthStatus();
      this._closeMobileMenu();
    });
  }

  _closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const icons = mobileMenuButton.querySelectorAll('svg');

    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      icons[0].classList.remove('hidden');
      icons[1].classList.add('hidden');
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