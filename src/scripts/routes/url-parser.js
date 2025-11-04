const UrlParser = {
  // Fungsi ini mengambil URL hash dan mengubahnya menjadi path
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splittedUrl = this._urlSplitter(url);
    return this._urlCombiner(splittedUrl);
  },

  // Fungsi ini mengambil URL hash TANPA menggabungkannya
  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url);
  },

  // Helper internal untuk memecah URL
  // Contoh: '#/home' -> ['home']
  // Contoh: '#/detail/123' -> ['detail', '123']
  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return {
      resource: urlsSplits[1] || null,
      id: urlsSplits[2] || null,
      verb: urlsSplits[3] || null,
    };
  },

  // Helper internal untuk menggabungkan pecahan URL menjadi path rute
  // Contoh: { resource: 'home' } -> '/home'
  // Contoh: { resource: 'detail', id: '123' } -> '/detail/:id'
  _urlCombiner(splittedUrl) {
    return (
      (splittedUrl.resource ? `/${splittedUrl.resource}` : '/') +
      (splittedUrl.id ? '/:id' : '') +
      (splittedUrl.verb ? `/${splittedUrl.verb}` : '')
    );
  },
};

// PENTING: Ekspor sebagai default
export default UrlParser;
