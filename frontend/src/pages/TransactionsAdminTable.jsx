import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

export default function TransactionsAdminTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:8080/transactions?status=Waiting&isFraud=1');
      setTransactions(res.data);
    } catch (err) {
      console.error('Eroare la preluarea tranzacțiilor în așteptare:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    socket.on('transaction_update', (data) => {
      console.log('Actualizare tranzacții primită:', data);
      fetchPending();
    });

    return () => {
      socket.off('transaction_update');
    };
  }, []);

  const handleUpdate = async (id, status, isFraud) => {
    try {
      await axios.put(`http://localhost:8080/transactions/${id}`, { status, isFraud });
      await fetchPending(); // Refresh list
    } catch (err) {
      console.error('Eroare la actualizarea tranzacției:', err);
    }
  };

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
            <th className="px-4 py-3">Fraudă?</th>
            <th className="px-4 py-3">Motivație</th>
            <th className="px-4 py-3">Acțiuni</th>
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
                  <span className="text-red-600 font-semibold">{tx.isFraud ? 'DA' : 'NU'}</span>
                </td>
                <td className="px-4 py-2">{tx.motivation}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(tx.id, 'Approved', false)}
                      className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Aprobă
                    </button>
                    <button
                      onClick={() => handleUpdate(tx.id, 'Rejected', true)}
                      className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Respinge
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
