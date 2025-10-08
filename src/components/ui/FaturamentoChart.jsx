// src/components/ui/FaturamentoChart.jsx
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

function FaturamentoChart({ faturamentos = [] }) {
  const data = {
    labels: ["Consultoria", "Desenvolvimento", "Treinamento", "Outros"],
    datasets: [
      {
        label: "Faturado por Serviço",
        // Lógica para agrupar e somar os valores por tipo de serviço
        data: [
          faturamentos
            .filter((f) => f.tipoServico === "Consultoria")
            .reduce((acc, f) => acc + f.valorTotal, 0),
          faturamentos
            .filter((f) => f.tipoServico === "Desenvolvimento")
            .reduce((acc, f) => acc + f.valorTotal, 0),
          faturamentos
            .filter((f) => f.tipoServico === "Treinamento")
            .reduce((acc, f) => acc + f.valorTotal, 0),
          faturamentos
            .filter(
              (f) =>
                !["Consultoria", "Desenvolvimento", "Treinamento"].includes(
                  f.tipoServico
                )
            )
            .reduce((acc, f) => acc + f.valorTotal, 0),
        ],
        backgroundColor: "rgba(14, 116, 144, 0.6)", // Cor ciano com transparência
        borderColor: "rgba(14, 116, 144, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
  };

  return (
    <div style={{ height: "350px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default FaturamentoChart;
