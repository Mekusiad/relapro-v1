// src/pages/FaturamentoGraficosPage.jsx
import React, { useState, useEffect } from 'react';
import { getFaturamentos } from '../services/faturamentoService.js';
import ServicoChart from '../components/ui/ServicoChart.jsx';
import EmpresaChart from '../components/ui/EmpresaChart.jsx';
import { PieChart, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

function FaturamentoGraficosPage() {
    const [faturamentos, setFaturamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await getFaturamentos();
            setFaturamentos(data);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div>Carregando gráficos...</div>;

    return (
        <div className="container">
            <div className="screen-header">
                <h1><PieChart size={32} /> Gráficos de Faturamento</h1>
                <Link to="/faturamento">
                    <Button variant="secondary-outline">Voltar para Faturamento</Button>
                </Link>
            </div>

            <div className="billing-page-grid">
                <div className="content-card">
                    <h2><PieChart size={20} /> Faturamento por Tipo de Serviço</h2>
                    <ServicoChart faturamentos={faturamentos} />
                </div>
                <div className="content-card">
                    <h2><BarChart2 size={20} /> Faturamento por Empresa</h2>
                    <EmpresaChart faturamentos={faturamentos} />
                </div>
            </div>
        </div>
    );
}

export default FaturamentoGraficosPage;