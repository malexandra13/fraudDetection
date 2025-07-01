import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../common/axios';

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const validate = () => {
    const errs = {};
    if (!values.email) errs.email = 'Emailul este obligatoriu';
    if (!values.password) errs.password = 'Parola este obligatorie';
    if (values.password.length < 6) errs.password = 'Parola trebuie să aibă minim 6 caractere';
    if (values.password !== values.confirmPassword)
      errs.confirmPassword = 'Parolele nu se potrivesc';
    if (!values.firstName) errs.firstName = 'Prenumele este obligatoriu';
    if (!values.lastName) errs.lastName = 'Numele este obligatoriu';
    return errs;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setError('');
    setSuccess(null);

    try {
      const response = await axios.post('auth/signup', values);
      if (response.status === 200) {
        setSuccess('Cont creat cu succes! Te poți autentifica.');
        navigate('/login');
      }
    } catch (err) {
      if (err.response?.data?.message?.name === "SequelizeUniqueConstraintError") {
        setError("Contul deja există!");
      } else {
        setError("Nu s-a putut crea contul.");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Înregistrare</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parolă</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmă Parola</label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prenume</label>
            <input
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nume</label>
            <input
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresă</label>
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              type="text"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Creează cont
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Ai deja un cont?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Autentifică-te aici
          </span>
        </p>
      </div>
    </div>
  );
}
