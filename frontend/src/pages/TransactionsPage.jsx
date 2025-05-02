import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import TransactionsTable from './TransactionsTable';
import { useAuth } from '../common/AuthProvider';
import axios from '../common/axios';

export default function TransactionsPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (user == null) {
      navigate('/login');
    }
    console.log(user)
    user && fetchClient();
  }, [isLoggedIn, user]);

  const fetchClient = async () => {
    try {
      const res = await axios.get(`/clients?UserId=${user.id}`);
      setProfile(res.data);
      console.log('ok', res.data)
      if (user?.role == 'client') {
        navigate("/transactions")
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Tranzacții</h1>
        {user && profile && <Link to="/transactions/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" /> Adaugă tranzacție
          </button>
        </Link>}
        {/* <Link to="/deposit/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" /> Alimentează cont
          </button>
        </Link> */}
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-2">Toate tranzacțiile</h2>
        <p className="text-sm text-gray-500 mb-4">Gestionează și vizualizează toate tranzacțiile tale</p>
        {user && profile && <TransactionsTable userId={user.id} />}
        {user && !profile && <div className='card p-5 text-red-500'>
          <h3>Completează-ți profilul mai întâi!</h3>
        </div>}
      </div>
    </div>
  );
}
