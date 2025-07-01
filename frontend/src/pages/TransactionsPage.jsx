import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import TransactionsTable from './TransactionsTable';
import { useAuth } from '../common/AuthProvider';
import axios from '../common/axios';

export default function TransactionsPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [hasAccounts, setHasAccounts] = useState(false);
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

      const accRes = await axios.get('accounts?UserId=' + user.id);
      if (accRes.data && accRes.data.length > 0) {
        setHasAccounts(true);
      }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Tranzacții</h1>
        {user && profile && hasAccounts && <Link to="/transactions/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" /> Adaugă tranzacție
          </button>
        </Link>}
        {!hasAccounts && user && profile && <div className="bg-white rounded-xl shadow p-4">
           <p className="text-gray-500 text-center">Pentru a putea efectua tranzacții, trebuie să îți asociezi un cont bancar.</p>
         </div>}
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-2">Toate tranzacțiile</h2>
        {profile && Object.keys(profile).length > 0 && (
          <p className="text-sm text-gray-500 mb-4">Gestionează și vizualizează toate tranzacțiile tale</p>
        )}

        {user && profile && Object.keys(profile).length > 0 && <TransactionsTable userId={user.id} />}

        {user && !profile && (
          <div className='card p-5 text-red-500'>
            <h3 className="text-lg font-bold">Pentru a putea efectua tranzacții, trebuie să îți completezi profilul. Te rugăm să adaugi informațiile necesare pentru a finaliza procesul de verificare KYC.</h3>
          </div>
        )}

      </div>
    </div>
  );
}
