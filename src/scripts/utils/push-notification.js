import CONFIG from '../config.js';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const PushNotificationHelper = {
  async init({ button }) {
    this._button = button;

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push Notification tidak didukung di browser ini.');
      this._button.style.display = 'none';
      return;
    }

    this._button.addEventListener('click', () => this._requestPermission());

    await this._checkSubscriptionStatus();
  },

  async _checkSubscriptionStatus() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      this._updateToggleButton(true);
    } else {
      this._updateToggleButton(false);
    }
  },

  async _requestPermission() {
    const status = await Notification.requestPermission();

    if (status === 'denied') {
      console.warn('Izin notifikasi ditolak.');
      return;
    }

    if (status === 'granted') {
      console.log('Izin notifikasi diberikan.');
      await this._subscribePush();
    }
  },

  async _subscribePush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('Sudah subscribe. Melakukan unsubscribe...');
      await this._unsubscribePush(subscription);
    } else {
      console.log('Melakukan subscribe...');
      try {
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
        });

        console.log('Berhasil subscribe:', newSubscription);

        this._updateToggleButton(true);
      } catch (error) {
        console.error('Gagal subscribe:', error.message);
      }
    }
  },

  async _unsubscribePush(subscription) {
    try {
      await subscription.unsubscribe();
      console.log('Berhasil unsubscribe.');
      this._updateToggleButton(false);
    } catch (error) {
      console.error('Gagal unsubscribe:', error.message);
    }
  },

  _updateToggleButton(isSubscribed) {
    const iconOn = document.getElementById('bell-icon-on');
    const iconOff = document.getElementById('bell-icon-off');

    if (isSubscribed) {
      iconOn.classList.remove('hidden');
      iconOff.classList.add('hidden');
      this._button.title = 'Unsubscribe Notifikasi';
    } else {
      iconOn.classList.add('hidden');
      iconOff.classList.remove('hidden');
      this._button.title = 'Subscribe Notifikasi';
    }
  },
};

export default PushNotificationHelper;