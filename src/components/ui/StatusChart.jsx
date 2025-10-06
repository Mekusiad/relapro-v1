// src/components/ui/StatusChart.jsx

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const STATUS_COLORS = {
  abertas: '#0ea5e9',         // sky-500
  andamento: '#f59e0b',       // amber-500
  aguardando_pecas: '#6366f1', // indigo-500
  finalizadas: '#22c55e',     // green-500
  canceladas: '#ef4444',      // red-500
};

const STATUS_LABELS = {
  abertas: 'Abertas',
  andamento: 'Em Andamento',
  aguardando_pecas: 'Aguard. Peças',
  finalizadas: 'Finalizadas',
  canceladas: 'Canceladas',
};


function StatusChart({ stats }) {
  const chartData = {
    labels: Object.keys(stats).map(key => STATUS_LABELS[key] || key),
    datasets: [
      {
        label: 'Ordens de Serviço',
        data: Object.values(stats),
        backgroundColor: Object.keys(stats).map(key => STATUS_COLORS[key] || '#cccccc'),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Cria o efeito "Donut"
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Distribuição de Status das OS',
        font: {
          size: 16,
          weight: '600',
        },
        padding: {
          bottom: 20,
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default StatusChart;