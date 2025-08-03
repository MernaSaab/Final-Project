import { useState, useEffect } from 'react';

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect (optional)
 * @param {boolean} loadOnMount - Whether to load data on component mount
 * @returns {Object} { data, loading, error, execute }
 */
const useApi = (apiFunction, dependencies = [], loadOnMount = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(loadOnMount);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'שגיאה בטעינת נתונים');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadOnMount) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, execute };
};

export default useApi;
