import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Signup from './pages/Signup';
import AppBar from './common/AppBar';
import ProfilePage from './pages/ProfilePage';
import TransactionsPage from './pages/TransactionsPage';
import NewTransactionPage from './pages/NewTransactionPage';
import BankAccountsPage from './pages/BankAccountsPage';
import AddBankAccountPage from './pages/AddBankAccountPage';
import EditBankAccountPage from './pages/EditBankAccountPage';
import './index.css';
import DepositPage from './pages/DepositPage';
import HistoryAdmin from './pages/HistoryAdmin';
import AdminAnalysisPage from './pages/AdminAnalysisPage';

function App() {
  return (
    <Router>
      <div>
        <AppBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/admin/history" element={<HistoryAdmin />} />
          <Route path="/transactions/new" element={<NewTransactionPage />} />
          <Route path="/deposit/new" element={<DepositPage />} />
          <Route path="/bank-accounts" element={<BankAccountsPage />} />
          <Route path="/bank-accounts/new" element={<AddBankAccountPage />} /> 
          <Route path="/bank-accounts/edit/:id" element={<EditBankAccountPage />} /> 
          <Route path="/admin/analysis" element={<AdminAnalysisPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;