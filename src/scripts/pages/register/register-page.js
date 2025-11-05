// ... (import biarkan sama) ...
import ApiSource from '../../data/api.js';
import RegisterPresenter from './register-presenter.js';

const RegisterPage = {
  async render() {
    return `
      <section class="register-page max-w-lg mx-auto p-4">
        <!-- 
          Tidak ada perubahan di sini.
          Kartu 'bg-white' akan terlihat bagus di background 'bg-slate-900'.
          Judul 'text-gray-900' sudah benar karena ada di dalam kartu.
        -->
        <div class="bg-white shadow-xl rounded-lg p-8">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Register Akun Baru</h2>
          
          <form id="register-form">
            <!-- ... (sisa form biarkan sama) ... -->
            <div id="loading-indicator" class="hidden mb-4 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
              Mendaftarkan...
            </div>
            <div id="error-message" class="hidden mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert"></div>
            <div id="success-message" class="hidden mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert"></div>

            <div class="mb-6">
              <label for="name-input" class="block mb-2 text-sm font-medium text-gray-900">Nama</label>
              <input type="text" id="name-input" name="name" 
                     class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     required>
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
                     required minlength="8">
                     <p class="text-xs text-gray-500 mt-1">Minimal 8 karakter.</p>
            </div>
            
            <button type="submit" id="submit-button" 
                    class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none 
                           focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center 
                           disabled:bg-gray-400 disabled:cursor-not-allowed">
              Register
            </button>
            
            <p class="text-sm text-center text-gray-600 mt-6">
              Sudah punya akun? 
              <a href="#/login" class="font-medium text-blue-600 hover:underline">
                Login di sini
              </a>
            </p>
          </form>
        </div>
      </section>
    `;
  },

  // ... (sisa file register-page.js biarkan sama persis) ...
  async afterRender() {
    console.log('RegisterPage.afterRender() dipanggil');
    new RegisterPresenter({
      view: this,
      model: ApiSource,
    });
  },
  getInput() {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    return { name, email, password };
  },
  setSubmitListener(callback) {
    const form = document.getElementById('register-form');
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
  showSuccess(message) {
    document.getElementById('success-message').innerHTML = message;
    document.getElementById('success-message').style.display = 'block';
  },
  redirectToLogin() {
    console.log('Register berhasil, mengarahkan ke Login...');
    setTimeout(() => {
      window.location.hash = '#/login';
    }, 2000);
  },
};

export default RegisterPage;