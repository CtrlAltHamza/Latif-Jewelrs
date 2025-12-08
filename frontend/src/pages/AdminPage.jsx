import { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminRatesSection from '../components/AdminRatesSection';
import { fetchRates } from '../api';

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadRates();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadRates = async () => {
    try {
      const data = await fetchRates();
      setRates(data);
    } catch (err) {
      console.error('Error loading rates:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {!token ? (
        <AdminLogin onLoginSuccess={setToken} />
      ) : (
        <AdminRatesSection rates={rates} fetchRates={loadRates} token={token} />
      )}
    </div>
  );
}