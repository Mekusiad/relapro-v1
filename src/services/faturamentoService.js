// src/services/faturamentoService.js

const STORAGE_KEY = 'nexuscontrol_faturamentos';

const loadFaturamentos = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            const initialData = [
                { id: 1, proposta: 'P2025-058', parceiro: 'Tech Solutions Ltda', tipoServico: 'Consultoria', notaFiscal: '1120', vencimento: '2025-08-15', valorTotal: 7500.00, valorLiquido: 6950.50, resumo: 'Consultoria para otimização de SE.' },
                { id: 2, proposta: 'P2025-061', parceiro: 'Engenharia Delta', tipoServico: 'Desenvolvimento', notaFiscal: '1121', vencimento: '2025-10-15', valorTotal: 12300.00, valorLiquido: 11800.00, resumo: 'Desenvolvimento de painel elétrico.' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(stored);
    } catch (e) {
        console.error("Falha ao carregar faturamentos", e);
        return [];
    }
};

const saveFaturamentos = (faturamentos) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(faturamentos));
    } catch (e) {
        console.error("Falha ao salvar faturamentos", e);
    }
};

export const getFaturamentos = async () => {
    await new Promise(res => setTimeout(res, 300));
    return loadFaturamentos();
};

export const addFaturamento = async (faturamentoData) => {
    await new Promise(res => setTimeout(res, 300));
    const faturamentos = loadFaturamentos();
    const newFaturamento = { ...faturamentoData, id: Date.now() };
    faturamentos.push(newFaturamento);
    saveFaturamentos(faturamentos);
    return newFaturamento;
};

// --- FUNÇÕES NOVAS ---
export const updateFaturamento = async (id, data) => {
    await new Promise(res => setTimeout(res, 200));
    let faturamentos = loadFaturamentos();
    faturamentos = faturamentos.map(f => (f.id === id ? { ...f, ...data } : f));
    saveFaturamentos(faturamentos);
    return data;
};

export const deleteFaturamento = async (id) => {
    await new Promise(res => setTimeout(res, 200));
    let faturamentos = loadFaturamentos();
    faturamentos = faturamentos.filter(f => f.id !== id);
    saveFaturamentos(faturamentos);
};