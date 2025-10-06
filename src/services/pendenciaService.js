// src/services/pendenciaService.js

const STORAGE_KEY = 'nexuscontrol_pendencias';

const loadPendencias = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            const initialData = [
                { id: 1, proposta: 'P2025-045', motivo: 'Aguardando aprovação do cliente', valor: 5200.00, pedidoCompra: 'PC-9876' },
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(stored);
    } catch (e) {
        return [];
    }
};

const savePendencias = (pendencias) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendencias));
};

export const getPendencias = async () => {
    await new Promise(res => setTimeout(res, 200));
    return loadPendencias();
};

export const addPendencia = async (data) => {
    await new Promise(res => setTimeout(res, 200));
    const pendencias = loadPendencias();
    const newPendencia = { ...data, id: Date.now() };
    pendencias.push(newPendencia);
    savePendencias(pendencias);
    return newPendencia;
};

// --- FUNÇÕES NOVAS ---
export const updatePendencia = async (id, data) => {
    await new Promise(res => setTimeout(res, 200));
    let pendencias = loadPendencias();
    pendencias = pendencias.map(p => (p.id === id ? { ...p, ...data } : p));
    savePendencias(pendencias);
    return data;
};

export const deletePendencia = async (id) => {
    await new Promise(res => setTimeout(res, 200));
    let pendencias = loadPendencias();
    pendencias = pendencias.filter(p => p.id !== id);
    savePendencias(pendencias);
};