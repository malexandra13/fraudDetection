import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HistoryTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:8080/transactions?status=Rejected');
      console.log(res.data[0].User.ClientProfile.lastName)
      setTransactions(res.data);
    } catch (err) {
      console.error('Eroare la preluarea tranzacțiilor în așteptare:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md mt-6">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-100 text-gray-900">
          <tr>
            <th className="px-4 py-3">Titular</th>
            <th className="px-4 py-3">Telefon</th>
            <th className="px-4 py-3">Sumă</th>
            <th className="px-4 py-3">Monedă</th>
            <th className="px-4 py-3">Descriere</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-500">Se încarcă...</td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-500">Nicio tranzacție în așteptare.</td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{tx.User.ClientProfile.lastName + ' ' + tx.User.ClientProfile.firstName}</td>
                <td className="px-4 py-2">{tx.User.ClientProfile.phone}</td>
                <td className="px-4 py-2">{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{tx.BankAccount?.currency}</td>
                <td className="px-4 py-2">{tx.description}</td>
                <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString('ro-RO') + ", " + new Date(tx.date).toLocaleTimeString('ro-RO')}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${tx.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      tx.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
