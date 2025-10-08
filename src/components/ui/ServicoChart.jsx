// src/components/ui/ServicoChart.jsx

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartColors = [
  "rgba(22, 78, 99, 0.7)",
  "rgba(14, 116, 144, 0.7)",
  "rgba(6, 182, 212, 0.7)",
  "rgba(103, 232, 249, 0.7)",
  "rgba(59, 130, 246, 0.7)",
];

function ServicoChart({ faturamentos = [] }) {
  const dataPorServico = faturamentos.reduce((acc, f) => {
    const tipo = f.tipoServico || "Não especificado";
    acc[tipo] = (acc[tipo] || 0) + (f.valorTotal || 0);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(dataPorServico),
    datasets: [
      {
        label: "Faturamento por Serviço",
        data: Object.values(dataPorServico),
        backgroundColor: chartColors,
        borderColor: chartColors.map((color) => color.replace("0.7", "1")),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // 1. Desativa a animação contínua
    animation: {
      duration: 0, // Nenhuma animação ao recarregar
    },
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Faturamento Total por Tipo de Serviço" },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return "R$ " + value.toLocaleString("pt-BR");
          },
        },
      },
    },
  };

  // 2. Altura do container reduzida
  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ServicoChart;
