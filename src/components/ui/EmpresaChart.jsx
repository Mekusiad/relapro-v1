// src/components/ui/EmpresaChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartColors = [
    'rgba(22, 78, 99, 0.7)', 
    'rgba(14, 116, 144, 0.7)',
    'rgba(6, 182, 212, 0.7)',
];

function EmpresaChart({ faturamentos = [] }) {
    const dataPorEmpresa = faturamentos.reduce((acc, f) => {
        const parceiro = f.parceiro || 'Não especificado';
        acc[parceiro] = (acc[parceiro] || 0) + (f.valorTotal || 0);
        return acc;
    }, {});

    const data = {
        labels: Object.keys(dataPorEmpresa),
        datasets: [{
            label: 'Faturamento por Empresa',
            data: Object.values(dataPorEmpresa),
            backgroundColor: chartColors,
            borderColor: chartColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1,
            borderRadius: 5,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        // 1. Desativa a animação contínua
        animation: {
            duration: 0
        },
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Top Empresas por Faturamento' }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value) {
                        return 'R$ ' + value.toLocaleString('pt-BR');
                    }
                }
            }
        }
    };

    // 2. Altura do container reduzida
    return (
        <div style={{ height: '300px' }}>
            <Bar data={data} options={options} />
        </div>
    );
}

export default EmpresaChart;