import { useState, useEffect } from 'react';
import { PortfolioData } from '../types';

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure fonts are ready before we potentially show the content
        await document.fonts.ready;
        
        const response = await fetch('./data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData: PortfolioData = await response.json();
        setData(jsonData);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
