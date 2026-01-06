import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    menu: { home: 'Home', orders: 'Orders', events: 'Events', settings: 'Settings' },
    auth: { 
      loginTitle: 'Login to Your Account',
      noAccount: 'Don\'t have an account yet?',
      registerLink: 'Sign up for free',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      signIn: 'Sign In',
      logout: 'Log Out',
      or: 'Or'
    },
    common: { 
      account: 'Account', 
      profile: 'Profile', 
      dashboard: 'Dashboard', 
      goBack: 'Go Back', 
      goHome: 'Go Home',
      total: 'Total',
      search: 'Search',
      submit: 'Submit',
      cancel: 'Cancel',
      page: 'Page',
      records: 'Records',
      noData: 'No data available',
      loading: 'Loading',
      addNew: 'Add New',
      max: 'Max'
    },
    forms: {
      file: {
        dropHere: 'Drop files here or click to upload'
      },
      tag: {
        addNew: 'Add tag'
      }
    },
    error: {
      pageNotFound: 'Page Not Found',
      anErrorOccurred: 'An Error Occurred',
      pageNotFoundDescription: 'The page you are looking for may have been moved, deleted, or never existed.',
      anErrorOccurredDescription: 'An unexpected issue occurred on our servers. Please try again later.'
    }
  },
  tr: {
    menu: { home: 'Anasayfa', orders: 'Siparişler', events: 'Etkinlikler', settings: 'Ayarlar' },
    auth: { 
      loginTitle: 'Hesabınıza Giriş Yapın',
      noAccount: 'Henüz hesabınız yok mu?',
      registerLink: 'Ücretsiz kaydolun',
      email: 'Email',
      password: 'Şifre',
      forgotPassword: 'Şifremi Unuttum',
      signIn: 'Giriş Yap',
      logout: 'Çıkış Yap',
      or: 'Veya'
    },
    common: { 
      account: 'Hesap', 
      profile: 'Profil', 
      dashboard: 'Kontrol Paneli', 
      goBack: 'Geri Dön', 
      goHome: 'Anasayfa',
      total: 'Toplam',
      search: 'Ara',
      submit: 'Gönder',
      cancel: 'İptal',
      page: 'Sayfa',
      records: 'Kayıt',
      noData: 'Kullanılabilir veri yok',
      loading: 'Yükleniyor',
      addNew: 'Yeni Ekle',
      max: 'Maks'
    },
    forms: {
      file: {
        dropHere: 'Dosyaları buraya bırakın veya yüklemek için tıklayın'
      },
      tag: {
        addNew: 'Etiket ekle'
      }
    },
    error: {
      pageNotFound: 'Sayfa Bulunamadı',
      anErrorOccurred: 'Bir Hata Oluştu',
      pageNotFoundDescription: 'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.',
      anErrorOccurredDescription: 'Sunucularımızda beklenmedik bir sorun oluştu. Lütfen biraz sonra tekrar deneyin.'
    }
  }
}

const systemLang = navigator.language.split('-')[0]
const locale = localStorage.getItem('lang') || (messages[systemLang] ? systemLang : 'en')

const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: 'en',
  messages
})

export default i18n