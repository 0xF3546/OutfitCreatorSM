import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Login from './components/views/Account/Login/Login';
import { DashboardView } from './components/views/Dashboard/Index';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import language from './components/etc/translation.json';
import Register from './components/views/Account/Login/Register';
import ResetPassword from './components/views/Account/Login/ResetPassword';
import { Logout } from './components/views/Account/Logout';

export const server = "https://localhost:7031"

const App: React.FC = () => {
  i18next
  .use(initReactI18next)
  .init(
    language
  )
  return (
    <div>
      <Routes>
        <Route path="/login" element={< Login />} />
        <Route path='/logout' element={< Logout />} />
        <Route path='/ResetPassword' element={< ResetPassword />} />
        <Route path='/register' element={< Register />} />
        <Route path='/*' element={< DashboardView />} />
      </Routes>
    </div>
  );
}

export default App;