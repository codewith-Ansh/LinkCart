import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import AppRouter from './router/AppRouter';
import './App.css';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
