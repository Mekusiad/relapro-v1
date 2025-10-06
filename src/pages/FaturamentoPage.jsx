// src/pages/FaturamentoPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFaturamentos, addFaturamento, updateFaturamento, deleteFaturamento } from '../services/faturamentoService.js';
import { getPendencias, addPendencia, updatePendencia, deletePendencia } from '../services/pendenciaService.js';
import { formatDate } from '../utils/helpers.js';

import Button from '../components/ui/Button.jsx';
import FaturamentoFormModal from '../components/modals/FaturamentoFormModal.jsx';
import PendenciaFormModal from '../components/modals/PendenciaFormModal.jsx';
import ConfirmationModal from '../components/modals/ConfirmationModal.jsx';
import { DollarSign, FileCheck2, AlertTriangle, Plus, PieChart, Edit, Trash2, Repeat } from 'lucide-react';

function FaturamentoPage() {
    // --- SEÇÃO DE ESTADOS (useState) ---
    const [allFaturamentos, setAllFaturamentos] = useState([]);
    const [allPendencias, setAllPendencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFaturaModalOpen, setIsFaturaModalOpen] = useState(false);
    const [isPendenciaModalOpen, setIsPendenciaModalOpen] = useState(false);
    const [editingFaturamento, setEditingFaturamento] = useState(null);
    const [editingPendencia, setEditingPendencia] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('monthly');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // --- SEÇÃO DE DADOS (useEffect para carregar) ---
    const loadData = async () => {
        setLoading(true);
        const [faturamentosData, pendenciasData] = await Promise.all([ getFaturamentos(), getPendencias() ]);
        setAllFaturamentos(faturamentosData);
        setAllPendencias(pendenciasData);
        setLoading(false);
    };
    useEffect(() => { loadData(); }, []);

    // --- SEÇÃO DE LÓGICA E CÁLCULOS (useMemo) ---
    const formatCurrency = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const { filteredFaturamentos, filteredPendencias, summary } = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();

        const filterByPeriod = (item) => {
            const checkDate = item.dataFaturamento ? new Date(item.dataFaturamento) : new Date(item.vencimento);
            if (viewMode === 'annual') {
                return checkDate.getFullYear() === year;
            }
            return checkDate.getFullYear() === year && checkDate.getMonth() === month;
        };

        const faturamentosDoPeriodo = allFaturamentos.filter(filterByPeriod);
        const pendenciasDoPeriodo = allPendencias.filter(filterByPeriod);
        const totalPendenteGeral = allPendencias.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
        const totalFaturado = faturamentosDoPeriodo.reduce((acc, f) => acc + (parseFloat(f.valorTotal) || 0), 0);
        const totalLiquido = faturamentosDoPeriodo.reduce((acc, f) => acc + (parseFloat(f.valorLiquido) || 0), 0);

        return {
            filteredFaturamentos: faturamentosDoPeriodo,
            filteredPendencias: pendenciasDoPeriodo,
            summary: {
                totalFaturado: formatCurrency(totalFaturado),
                totalLiquido: formatCurrency(totalLiquido),
                totalPendente: formatCurrency(totalPendenteGeral),
            }
        };
    }, [allFaturamentos, allPendencias, selectedDate, viewMode]);

    // --- SEÇÃO DE FUNÇÕES (Handlers) ---
    const handleSaveFatura = async (data) => {
        if (data.id) await updateFaturamento(data.id, data); else await addFaturamento(data);
        setIsFaturaModalOpen(false); setEditingFaturamento(null); loadData();
    };
    const handleSavePendencia = async (data) => {
        if (data.id) await updatePendencia(data.id, data); else await addPendencia(data);
        setIsPendenciaModalOpen(false); setEditingPendencia(null); loadData();
    };
    const handleEditFatura = (fatura) => { setEditingFaturamento(fatura); setIsFaturaModalOpen(true); };
    const handleEditPendencia = (pendencia) => { setEditingPendencia(pendencia); setIsPendenciaModalOpen(true); };
    const handleDeleteClick = (item, type) => { setItemToDelete({ ...item, type }); };
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'fatura') await deleteFaturamento(itemToDelete.id);
        else await deletePendencia(itemToDelete.id);
        setItemToDelete(null); loadData();
    };

    if (loading) return <div>Carregando...</div>;

    const periodLabel = viewMode === 'monthly' ? `(${selectedDate.toLocaleString('pt-BR', { month: 'long' })})` : `(Ano de ${selectedDate.getFullYear()})`;

    // --- SEÇÃO DE RENDERIZAÇÃO (return) ---
    return (
        <div className="faturamento-page-container">
            <div className="container">
                <div className="screen-header">
                    <h1><DollarSign size={32} /> Faturamento</h1>
                    <div className='header-actions'>
                        <select value={selectedDate.getMonth()} disabled={viewMode === 'annual'} onChange={(e) => setSelectedDate(new Date(selectedDate.getFullYear(), parseInt(e.target.value)))} className="input">
                            {Array.from({length: 12}, (_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('pt-BR', {month: 'long'})}</option>)}
                        </select>
                        <select value={selectedDate.getFullYear()} onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), selectedDate.getMonth()))} className="input">
                            {[2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <Button variant="secondary" onClick={() => setViewMode(viewMode === 'monthly' ? 'annual' : 'monthly')}><Repeat size={16}/> {viewMode === 'monthly' ? 'Anual' : 'Mensal'}</Button>
                        <span style={{width: '2px', backgroundColor: 'var(--gray-light)', margin: '0 0.5rem'}}></span>
                        <Button variant="secondary-outline" onClick={() => setIsPendenciaModalOpen(true)}><Plus size={20} /> Pendência</Button>
                        <Button variant="primary" onClick={() => setIsFaturaModalOpen(true)}><Plus size={20} /> Fatura</Button>
                        <Link to="/faturamento/graficos"><Button variant="secondary"><PieChart size={20} /> Gráficos</Button></Link>
                    </div>
                </div>

                <div className="billing-summary-grid">
                    <div className="summary-card">
                        <div className="summary-icon icon-faturado"><FileCheck2 /></div>
                        <div className="summary-info">
                            <p className="card-value">{summary.totalFaturado}</p>
                            <p className="card-label">Valor Faturado {periodLabel}</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon icon-liquido"><DollarSign /></div>
                        <div className="summary-info">
                            <p className="card-value">{summary.totalLiquido}</p>
                            <p className="card-label">Valor Líquido {periodLabel}</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon icon-pendente"><AlertTriangle /></div>
                        <div className="summary-info">
                            <p className="card-value">{summary.totalPendente}</p>
                            <p className="card-label">Total de Pendências</p>
                        </div>
                    </div>
                </div>

                <div className="faturamento-tables-wrapper">
                    <div className="billing-table-container">
                        <h2>Faturamentos Pendentes</h2>
                        <table className="billing-table">
                            <thead><tr><th>Proposta</th><th>Motivo</th><th>Data</th><th>Valor (R$)</th><th>Pedido de Compra</th><th>Ações</th></tr></thead>
                            <tbody>
                                {filteredPendencias.length > 0 ? filteredPendencias.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.proposta}</td>
                                        <td>{p.motivo}</td>
                                        <td>{formatDate(p.dataFaturamento)}</td>
                                        <td>{formatCurrency(parseFloat(p.valor))}</td>
                                        <td>{p.pedidoCompra || 'N/A'}</td>
                                        <td>
                                            <div className="table-actions">
                                                <Button size="sm" variant="icon" onClick={() => handleEditPendencia(p)}><Edit size={16} /></Button>
                                                <Button size="sm" variant="icon-danger" onClick={() => handleDeleteClick(p, 'pendencia')}><Trash2 size={16} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma pendência para este período.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="billing-table-container">
                         <h2>Histórico de Faturas Emitidas {periodLabel}</h2>
                         <table className="billing-table">
                            <thead><tr><th>Proposta</th><th>Parceiro</th><th>Data Faturamento</th><th>Vencimento</th><th>Vlr. Total</th><th>Vlr. Líquido</th><th>Ações</th></tr></thead>
                            <tbody>
                                {filteredFaturamentos.length > 0 ? filteredFaturamentos.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.proposta}</td>
                                        <td>{f.parceiro}</td>
                                        <td>{formatDate(f.dataFaturamento)}</td>
                                        <td>{formatDate(f.vencimento)}</td>
                                        <td>{formatCurrency(parseFloat(f.valorTotal))}</td>
                                        <td>{formatCurrency(parseFloat(f.valorLiquido))}</td>
                                        <td>
                                            <div className="table-actions">
                                                <Button size="sm" variant="icon" onClick={() => handleEditFatura(f)}><Edit size={16} /></Button>
                                                <Button size="sm" variant="icon-danger" onClick={() => handleDeleteClick(f, 'fatura')}><Trash2 size={16} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" style={{ textAlign: 'center' }}>Nenhum faturamento para este período.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <FaturamentoFormModal isOpen={isFaturaModalOpen} onRequestClose={() => { setIsFaturaModalOpen(false); setEditingFaturamento(null); }} onSave={handleSaveFatura} faturamentoToEdit={editingFaturamento} />
                <PendenciaFormModal isOpen={isPendenciaModalOpen} onRequestClose={() => { setIsPendenciaModalOpen(false); setEditingPendencia(null); }} onSave={handleSavePendencia} pendenciaToEdit={editingPendencia} />
                <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={handleConfirmDelete} title="Confirmar Exclusão" message="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita." />
            </div>
        </div>
    );
}

export default FaturamentoPage;