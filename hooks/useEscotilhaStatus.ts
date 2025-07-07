import { useState } from 'react';

export function useEscotilhaStatus() {
  const [status, setStatus] = useState('ABERTO');

  const toggleStatus = async () => {
    const newStatus = status === 'ABERTO' ? 'FECHADO' : 'ABERTO';
    setStatus(newStatus);

    try {
      const response = await fetch('http://localhost:8080/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      console.log('Resposta da API:', data);
    } catch (err) {
      console.error('Erro ao enviar status:', err);
    }
  };

  return { status, toggleStatus };
}
