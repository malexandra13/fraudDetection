import React, { useEffect, useState } from 'react';
import axios from '../common/axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

export default function TransactionsTable({userId}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('transactions?UserId=' + userId);
        setTransactions(response.data);
        console.log(response.data)
      } catch (err) {
        console.error('Eroare la preluarea tranzacțiilor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    socket.on('transaction_update', (data) => {
      console.log('Actualizare tranzacții primită:', data);
      fetchTransactions(); 
    });

    return () => {
      socket.off('transaction_update');
    };
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-100 text-gray-900">
          <tr>
            <th className="px-4 py-3">Cont</th>
            <th className="px-4 py-3">Sumă</th>
            <th className="px-4 py-3">Monedă</th>
            <th className="px-4 py-3">Descriere</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Fraudă?</th>
            <th className="px-4 py-3">Motivație</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-500">Se încarcă tranzacțiile...</td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-500">Nu există tranzacții.</td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{tx.BankAccountId}</td>
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
                <td className="px-4 py-2">
                  {tx.isFraud ? (
                    <span className="text-red-600 font-semibold">DA</span>
                  ) : (
                    <span className="text-green-600 font-medium">NU</span>
                  )}
                </td>
                <td className="px-4 py-2">{tx.motivation}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
