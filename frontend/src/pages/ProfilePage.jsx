import React, { useEffect, useState } from 'react';
import { useAuth } from '../common/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../common/axios';

export default function ProfilePage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    user && fetchProfile();
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('clients?UserId=' + user.id);
      if (res.status === 200 && res.data.length > 0) {
        setFormData(res.data[0])
      }
    } catch (err) {
      setMessage('A apărut o eroare la preluarea profilului.');
      console.error(err);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        Nu ești autentificat.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (formData.phone.length != 10) {
      setMessage("Telefonul nu este valid.");
      return;
    }
    try {
      const res = await axios.post('clients', {
        ...formData,
        UserId: user.id
      });
      if (res.status === 201) {
        setMessage('Profilul clientului a fost salvat cu succes!');
      }
    } catch (err) {
      setMessage('A apărut o eroare la salvarea profilului.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4 text-center">Profilul tău</h2>
      {user != null && <div className="space-y-3 mb-8 text-gray-900">
        <p><span className="font-medium text-gray-700">id:</span> {user.id || 'N/A'}</p>
        <p><span className="font-medium text-gray-700">Nume:</span> {user.ClientProfile?.lastName || 'N/A'}</p>
        <p><span className="font-medium text-gray-700">Prenume:</span> {user.ClientProfile?.firstName || 'N/A'}</p>
        <p><span className="font-medium text-gray-700">Adresă:</span> {user.ClientProfile?.address || 'N/A'}</p>
        <p><span className="font-medium text-gray-700">Telefon:</span> {user.ClientProfile?.phone || 'N/A'}</p>
        <p><span className="font-medium text-gray-700">Email:</span> {user.email || 'N/A'}</p>

      </div>}

      <h3 className="text-xl font-medium text-gray-800 mb-4 text-center">Actualizare date</h3>
      {message && <p className="text-center text-sm text-blue-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prenume</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nume</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adresă</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Salvează profil
        </button>
      </form>
    </div>
  );
}
