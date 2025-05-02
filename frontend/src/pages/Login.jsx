import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../common/axios';
import { useAuth } from '../common/AuthProvider';

export default function Login() {
  const { isLoggedIn, login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate('/' + redirect);
      } else {
        navigate('/');
      }
    }
  }, [isLoggedIn]);

  const validate = () => {
    const errs = {};
    if (!values.email) errs.email = 'Emailul este obligatoriu';
    if (!values.password) errs.password = 'Parola este obligatorie';
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
      const response = await axios.post('auth/login', values);
      if (response.status === 200) {
        login(response.data);
        localStorage.setItem('token', response.data.token);
        setSuccess('Autentificare reușită!');
        navigate('/');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'A apărut o eroare');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Autentificare</h2>

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
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Conectează-te
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Nu ai cont?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Creează unul aici
          </span>
        </p>
      </div>
    </div>
  );
}
