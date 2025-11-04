import ApiSource from '../../data/api.js';
import LoginPresenter from './login-presenter.js';

const LoginPage = {
  async render() {
    return `
      <section class="login-page max-w-lg mx-auto p-4">
        <div class="bg-white shadow-xl rounded-lg p-8">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Login Pengguna</h2>
          
          <form id="login-form">
            
            <div id="loading-indicator" class="hidden mb-4 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
              Loading...
            </div>
            <div id="error-message" class="hidden mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              </div>
            
            <div class="mb-6">
              <label for="email-input" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input type="email" id="email-input" name="email" 
                     class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     placeholder="nama@email.com" required>
            </div>
            
            <div class="mb-6">
              <label for="password-input" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input type="password" id="password-input" name="password" 
                     class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     required>
            </div>
            
            <button type="submit" id="submit-button" 
                    class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none 
                           focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center 
                           disabled:bg-gray-400 disabled:cursor-not-allowed">
              Login
            </button>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    console.log('LoginPage.afterRender() dipanggil');
    new LoginPresenter({
      view: this,
      model: ApiSource,
    });
  },

  // === Fungsi View (tetap sama, hanya targetnya beda) ===
  getInput() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    return { email, password };
  },
  setSubmitListener(callback) {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      callback();
    });
  },
  showLoading() {
    document.getElementById('loading-indicator').style.display = 'block';
    document.getElementById('submit-button').disabled = true;
  },
  hideLoading() {
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('submit-button').disabled = false;
  },
  showError(message) {
    document.getElementById('error-message').innerHTML = message;
    document.getElementById('error-message').style.display = 'block';
  },
  hideError() {
    document.getElementById('error-message').style.display = 'none';
  },
  redirectToHome() {
    console.log('Login berhasil, mengarahkan ke Home...');
    window.location.hash = '#/home';
  },
};

export default LoginPage;