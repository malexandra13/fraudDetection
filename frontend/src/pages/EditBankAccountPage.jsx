import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../common/axios';

export default function EditBankAccountPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ balance: '', currency: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`accounts/${id}`).then(res => {
      setFormData({
        balance: res.data.balance,
        currency: res.data.currency,
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`accounts/${id}`, {
        ...formData,
        balance: parseFloat(formData.balance),
      });
      navigate('/bank-accounts');
    } catch (err) {
      setMessage('Eroare la actualizarea contului.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Editează cont bancar</h1>
      {message && <p className="text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sold</label>
          <input type="number" name="balance" value={formData.balance} onChange={handleChange}
            className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monedă</label>
          <input type="text" name="currency" value={formData.currency} onChange={handleChange}
            className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Anulează</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvează</button>
        </div>
      </form>
    </div>
  );
}
