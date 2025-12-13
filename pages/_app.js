import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { ToastContainer } from 'react-toastify';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

function ToastWrapper() {
  const { isRTL } = useLanguage();
  
  return (
    <ToastContainer
      position={isRTL ? "top-left" : "top-right"}
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={isRTL}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

function AppContent({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastWrapper />
    </AuthProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;

