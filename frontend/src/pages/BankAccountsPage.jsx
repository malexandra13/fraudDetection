import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../common/axios';
import { useAuth } from '../common/AuthProvider';

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) {
      navigate('/login');
    }
    if (user?.role != 'client') {
      navigate("/")
    }
  }, [isLoggedIn]);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('accounts?UserId=' + user.id);
      setAccounts(res.data);
    } catch (err) {
      console.error('Eroare la preluarea conturilor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`accounts/${id}`);
      fetchAccounts();
    } catch (err) {
      console.error('Eroare la ștergerea contului:', err);
    }
  };

  useEffect(() => {
    user && fetchAccounts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Conturi bancare</h1>
        <Link to="/bank-accounts/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Adaugă cont
        </Link>

        <Link to="/deposit/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Alimentează cont
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <p className="text-gray-500 text-center">Se încarcă conturile...</p>
        ) : accounts.length === 0 ? (
          <p className="text-gray-500 text-center">Nu ai conturi bancare.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2">Sold</th>
                <th className="px-4 py-2">Monedă</th>
                <th className="px-4 py-2">IBAN</th>
                <th className="px-4 py-2 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{acc.balance.toFixed(2)}</td>
                  <td className="px-4 py-2">{acc.currency}</td>
                  <td className="px-4 py-2">{acc.id}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Link to={`/bank-accounts/edit/${acc.id}`} className="text-blue-600 hover:underline">Editează</Link>
                    <button onClick={() => handleDelete(acc.id)} className="text-red-600 hover:underline">Șterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
