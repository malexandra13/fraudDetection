import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../common/axios';
import { useAuth } from '../common/AuthProvider';

export default function DepositPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    BankAccountId: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      axios.get(`/accounts?UserId=${user.id}`)
        .then(res => setAccounts(res.data))
        .catch(err => console.error('Eroare conturi:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        UserId: user.id
      });
      setMessage('Depozitul a fost adăugat cu succes!');
      setTimeout(() => navigate('/transactions'), 1000);
    } catch (error) {
      setMessage('Eroare la adăugarea tranzacției.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Alimentează</h1>
      {message && <p className="text-center text-sm text-blue-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cont bancar</label>
          <select
            name="BankAccountId"
            value={formData.BankAccountId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selectează contul</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.id} {account.currency} - Sold: {account.balance}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sumă</label>
          <input
            type="number"
            name="amount" min={0}
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descriere</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex. alimentare surse proprii"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border text-white rounded bg-gray-700 hover:bg-gray-500"
          >
            Anulează
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvează
          </button>
        </div>
      </form>
    </div>
  );
}
