// frontend/src/components/pdf/tabelas/TabelaDisjuntorMedia.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import ComponentInfoHeaderPdf from "./ComponentInfoHeaderPdf.jsx";
import CondicoesEnsaioPdf from "./CondicoesEnsaioPdf.jsx";
// ==================================================
// INÍCIO DA CORREÇÃO
// 1. Importar os novos componentes
// ==================================================
import EnsaioEquipamentosPdf from "./EnsaioEquipamentosPdf.jsx";
import EnsaioFotosPdf from "./EnsaioFotosPdf.jsx";
// ==================================================
// FIM DA CORREÇÃO
// ==================================================

// Estilos (sem alterações)
const styles = StyleSheet.create({
  container: { fontFamily: "Roboto" },
  ensaioWrapper: {
    paddingTop: 10,
    borderTop: "1px solid #e2e8f0",
    marginTop: 10,
  },
  section: { marginBottom: 15 },
  subtitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#164e63",
    backgroundColor: "#f0f9ff",
    padding: "5px 8px",
    borderRadius: 4,
    marginBottom: 8,
    borderLeft: "3px solid #0ea5e9",
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: { flexDirection: "row", borderBottom: "1px solid #f1f5f9" },
  tableRowZebra: { backgroundColor: "#f8fafc" },
  tableColHeader: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderRight: "1px solid #e2e8f0",
  },
  tableCol: {
    flex: 1,
    padding: 5,
    fontSize: 8,
    textAlign: "center",
    borderRight: "1px solid #e2e8f0",
  },
  diagnosisSection: {
    marginTop: 15,
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: 10,
    borderRadius: 4,
  },
  obsText: { fontSize: 9, color: "#475569", fontStyle: "italic" },
  obsLabel: { fontWeight: "bold", color: "#334155" },
  nonConformityText: { color: "#be123c", fontWeight: "bold" },
  // Estilos para a lista de serviços
  servicosList: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  servicoItem: { fontSize: 9, color: "#475569" },
});

// Componentes auxiliares (sem alterações)
const EnsaioTable = ({ title, data, columns }) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, { backgroundColor: "#f1f5f9" }]}>
          {columns.map((col) => (
            <Text
              key={col.accessor}
              style={[styles.tableColHeader, { flex: col.width || 1 }]}
            >
              {col.Header}
            </Text>
          ))}
        </View>
        {data.map((row, i) => (
          <View
            key={row.id || i}
            style={[styles.tableRow, i % 2 === 0 ? styles.tableRowZebra : {}]}
          >
            {columns.map((col) => (
              <Text
                key={col.accessor}
                style={[styles.tableCol, { flex: col.width || 1 }]}
              >
                {row[col.accessor] || "N/A"}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const ServicosSection = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;
  const servicosRealizados = Object.entries(data).filter(
    ([, value]) => value === "sim"
  );
  if (servicosRealizados.length === 0) return null;

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>Serviços Executados</Text>
      <View style={styles.servicosList}>
        {servicosRealizados.map(([key]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          return (
            <Text key={key} style={styles.servicoItem}>
              • {label}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

// --- Colunas das Tabelas (sem alterações) ---
const contatoColumns = [
  /* ... */
];
const isolamentoColumns = [
  /* ... */
];

// --- Componente Principal ---
const TabelaDisjuntorMedia = ({ componente, Html, stylesheet }) => {
  if (!componente || !componente.ensaios || componente.ensaios.length === 0)
    return null;

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />

      {componente.ensaios.map((ensaio) => {
        const ensaioData = ensaio.dados || {};
        const {
          resistenciaContato,
          resistenciaIsolamentoAberto,
          resistenciaIsolamentoFechado,
          servicos,
        } = ensaioData;

        return (
          <View key={ensaio.id} style={styles.ensaioWrapper} wrap={false}>
            <CondicoesEnsaioPdf ensaio={ensaio} />
            <EnsaioTable
              title="Resistência de Contato (µΩ)"
              data={resistenciaContato}
              columns={contatoColumns}
            />
            <EnsaioTable
              title="Resistência de Isolamento (MΩ) - Disjuntor Aberto"
              data={resistenciaIsolamentoAberto}
              columns={isolamentoColumns}
            />
            <EnsaioTable
              title="Resistência de Isolamento (MΩ) - Disjuntor Fechado"
              data={resistenciaIsolamentoFechado}
              columns={isolamentoColumns}
            />

            <ServicosSection data={servicos} />

            {(ensaioData.observacoes || ensaioData.naoConforme) && (
              <View style={styles.diagnosisSection} wrap={false}>
                <Text style={styles.subtitle}>
                  Observações e Diagnóstico do Ensaio
                </Text>
                {ensaioData.observacoes && (
                  <Text style={styles.obsText}>"{ensaioData.observacoes}"</Text>
                )}
                {ensaioData.naoConforme && (
                  <View
                    style={[
                      styles.obsText,
                      { marginTop: ensaioData.observacoes ? 8 : 0 },
                    ]}
                  >
                    <Text style={styles.obsLabel}>Diagnóstico: </Text>
                    {Html && stylesheet ? (
                      <Html stylesheet={stylesheet}>
                        {ensaioData.naoConformeDetalhes || "Não Conforme"}
                      </Html>
                    ) : (
                      <Text style={styles.nonConformityText}>
                        {ensaioData.naoConformeDetalhes || "Não Conforme"}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}

            <EnsaioEquipamentosPdf equipamentos={ensaio.equipamentos} />
            <EnsaioFotosPdf fotos={ensaio.fotos} />
          </View>
        );
      })}
    </View>
  );
};

export default TabelaDisjuntorMedia;
