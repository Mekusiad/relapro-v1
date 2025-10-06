// src/components/ui/PerformanceChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PerformanceChart() {
  const data = {
    labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
    datasets: [
      {
        label: 'OS Concluídas',
        data: [12, 19, 15, 22, 18, 25],
        backgroundColor: 'rgba(42, 122, 79, 0.5)',
        borderColor: 'rgba(42, 122, 79, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default PerformanceChart;