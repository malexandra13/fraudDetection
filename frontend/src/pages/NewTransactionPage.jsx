import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthProvider';

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    BankAccountId: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({});


  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:8080/accounts?UserId=${user.id}`)
        .then(res => setAccounts(res.data))
        .catch(err => console.error('Eroare conturi:', err));
    }
    if (user) {
      axios.get(`http://localhost:8080/clients?UserId=${user.id}`)
        .then(res => {
          if (res.data.id) {
            setProfile(res.data);
          } else if (user?.role == 'client') {
            navigate("/transactions")
          }
        })
        .catch(err => console.error('Eroare:', err));
      if (user == null) {
        navigate('/login');
      }
      if (user?.role != 'client') {
        navigate("/")
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trimitePredictie = async tranzactie => {
    try {
      const account = accounts.find(a => a.id == tranzactie.BankAccountId);
      const hour = new Date(tranzactie.date).getHours();
      const res = await axios.get(`http://localhost:8080/transactions?BankAccountId=${tranzactie.BankAccountId}`);
      const toateTranzactiile = res.data;
      const recentTranzactii = toateTranzactiile.filter(tx => {
        const txDate = new Date(tx.date);
        const dif = Math.abs(txDate.getTime() - new Date(tranzactie.date).getTime()) / 1000;
        return dif < 3600;
      });

      const recentTxCount = recentTranzactii.length;

      const predict = {
        amount: tranzactie.amount, balance: account.balance, currency: account.currency,
        hour, description: tranzactie.description, recentTxCount
      }
      const response = await axios.post("http://localhost:8081/predict", {
        predict
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      const { isFraud, fraudProbability, explanation } = response.data;
      const interpretari = {
        amount: "suma este foarte mare",
        balance: "soldul este foarte mic raportat la sumă",
        currency: "moneda este diferită de RON",
        hour: "ora este neobișnuită",
        description: "descrierea este vagă sau scurtă",
        recentTxCount: "există activitate intensă recentă"
      };

      const motiveClare = explanation
        .filter(([_, impact]) => impact > 0.01)
        .filter(([feature]) => {
          if (feature === "currency" && predict.currency === "RON") return false;
          return true;
        })
        .map(([feature]) => interpretari[feature])
        .filter(Boolean)
        .slice(0, 3);

      const frazaMotive = motiveClare.length > 0
        ? motiveClare.length === 1
          ? motiveClare[0]
          : motiveClare.slice(0, -1).join(", ") + " și " + motiveClare.slice(-1)
        : "nicio caracteristică clară nu a indicat fraudă";

      const mesaj = isFraud
        ? `🚨 Tranzacție posibil frauduloasă! Probabilitate: ${(fraudProbability * 100).toFixed(1)}%. Motive: ${frazaMotive}.`
        : `✅ Tranzacție considerată sigură. Probabilitate fraudă: ${(fraudProbability * 100).toFixed(1)}%. Dar trebuie avut în vedere că ${frazaMotive}.`;
      return { ...tranzactie, motivation: mesaj, isFraud, status: isFraud ? 'Waiting' : 'Approved' }
    } catch (err) {
      console.error("Eroare API:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const toAdd = await trimitePredictie({
        ...formData, date: new Date(formData.date).toUTCString(),
        amount: parseFloat(formData.amount),
        UserId: user.id
      });
      await axios.post('http://localhost:8080/transactions', toAdd);
      setMessage('Tranzacția a fost adăugată cu succes!');

      setTimeout(() => navigate('/transactions'), 500);
    } catch (error) {
      setMessage('Eroare la adăugarea tranzacției.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Adaugă tranzacție nouă</h1>
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
            name="amount" max={formData.BankAccountId.length > 0 ? accounts.find(b => b.id == formData.BankAccountId).balance : 0}
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
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
            placeholder="Ex. plata chirie"
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
            Salvează tranzacția
          </button>
        </div>
      </form>
    </div>
  );
}
