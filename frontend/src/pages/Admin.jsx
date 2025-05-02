import React, { useEffect } from 'react';
import TransactionsAdminTable from './TransactionsAdminTable';
import { useAuth } from '../common/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null || user.role != 'admin') {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Panou Administrator</h1>
      <p>Tranzacții în așteptare și gestiunea activității clienților.</p>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-200 mb-4">Tranzacții în așteptare</h1>
        <TransactionsAdminTable />
      </div>
    </div>
  );
}
