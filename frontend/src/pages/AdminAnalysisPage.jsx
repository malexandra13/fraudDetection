import React, { useEffect, useState } from 'react';
import axios from '../common/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthProvider';

const COLORS = ['#0088FE', '#FF8042'];

export default function AdminAnalysisPage() {
  const [stats, setStats] = useState({ fraud: 0, legit: 0 });
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null || user.role != 'admin') {
      navigate("/");
    }
  }, [isLoggedIn]);

  const fetchStats = async (userId = '') => {
    const res = await axios.get('transactions/stats/general', {
      params: userId ? { userId } : {}
    });
    console.log(res)
    setStats({ fraud: res.data.fraud, legit: res.data.legit });
  };

  const fetchClients = async () => {
    const res = await axios.get('transactions/stats/clients');
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, []);

  const handleClientChange = (e) => {
    const id = e.target.value;
    setSelectedClient(id);
    fetchStats(id);
  };

  const chartData = [
    { name: 'Frauduloase', value: stats.fraud },
    { name: 'Legitime', value: stats.legit }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-100 mb-4">Analiza tranzacțiilor</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Grafic */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="w-full md:w-1/3">
          <label className="block mb-2 text-white-700 font-medium">Selectează client</label>
          <select
            onChange={handleClientChange}
            value={selectedClient}
            className="w-full border px-3 py-2 rounded text-gray-800"
          >
            <option value="">Toți clienții</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.fullName || client.email}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
