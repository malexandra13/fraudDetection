import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../common/axios';
import { useAuth } from '../common/AuthProvider';

export default function AddBankAccountPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ balance: '', currency: 'RON' });
  const [message, setMessage] = useState('');
  const { isLoggedIn, user } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('accounts', {
        ...formData, UserId: user.id,
        balance: parseFloat(formData.balance),
      });
      navigate('/bank-accounts');
    } catch (err) {
      setMessage('Eroare la salvarea contului.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Adaugă cont bancar</h1>
      {message && <p className="text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sold inițial</label>
          <input type="number" name="balance" value={formData.balance} onChange={handleChange}
            className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monedă</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selectează moneda</option>
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Renunță</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvează</button>
        </div>
      </form>
    </div>
  );
}
