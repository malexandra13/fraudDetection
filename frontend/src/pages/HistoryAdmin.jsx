import React, { useEffect } from 'react';
import { useAuth } from '../common/AuthProvider';
import { useNavigate } from 'react-router-dom';
import HistoryTable from './HistoryTable';

export default function HistoryAdmin() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null || user.role != 'admin') {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Istoric</h1>
      <p>Tranzacții considerate fraudă.</p>
      <div className="p-6">
        <HistoryTable />
      </div>
    </div>
  );
}
