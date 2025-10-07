// src/components/pdf/tabelas/TabelaDisjuntorMedia.jsx (EXEMPLO A SER REPLICADO)

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import ComponentInfoHeaderPdf from "./ComponentInfoHeaderPdf.jsx";
import CondicoesEnsaioPdf from "./CondicoesEnsaioPdf.jsx";

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
  serviceGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 9,
    width: "48%",
  },
  serviceLabel: { flex: 1 },
  serviceValue: { fontWeight: "bold" },
  diagnosisSection: { marginTop: 15 },
  obsText: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#475569",
    lineHeight: 1.4,
  },
  obsLabel: { fontWeight: "bold" },
  nonConformityText: { color: "#dc2626" },
});

// Componente para renderizar tabelas genéricas
const EnsaioTable = ({ title, data, columns }) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {columns.map((col) => (
            <Text
              key={col.key}
              style={{ ...styles.tableColHeader, flex: col.width || 1 }}
            >
              {col.label}
            </Text>
          ))}
        </View>
        {data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.tableRow,
              rowIndex % 2 === 0 ? styles.tableRowZebra : {},
            ]}
          >
            {columns.map((col) => (
              <Text
                key={col.key}
                style={{ ...styles.tableCol, flex: col.width || 1 }}
              >
                {row[col.key] || "N/A"}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// Componente para a seção de serviços
const ServicosSection = ({ data }) => {
  if (!data) return null;
  const servicos = Object.entries(data).filter(([_, value]) => value);
  if (servicos.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Serviços Efetuados</Text>
      <View style={styles.serviceGrid}>
        {servicos.map(([key, value]) => (
          <View key={key} style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              :
            </Text>
            <Text style={styles.serviceValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Componente principal da tabela de Disjuntor de Média
const TabelaDisjuntorMedia = ({ componente, Html, stylesheet }) => {
  const contatoColumns = [
    { key: "polo", label: "Pólo" },
    { key: "disjuntor", label: "Disjuntor" },
    { key: "corrente", label: "Corrente (A)" },
    { key: "medido", label: "Valor Medido (µΩ)" },
    { key: "referencia", label: "Valor Ref. (µΩ)" },
    { key: "tempo", label: "Tempo (s)" },
  ];
  const isolamentoColumns = [
    { key: "polo", label: "Pólo" },
    { key: "disjuntor", label: "Disjuntor" },
    { key: "tensao", label: "Tensão (V)" },
    { key: "medido", label: "Valor Medido (MΩ)" },
    { key: "referencia", label: "Valor Ref. (MΩ)" },
    { key: "tempo", label: "Tempo (s)" },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />

      {componente.ensaios.map((ensaio, index) => {
        const ensaioData = ensaio.dados || {};
        const {
          resistenciaContato,
          resistenciaIsolamentoAberto,
          resistenciaIsolamentoFechado,
          servicos,
        } = ensaioData;

        return (
          <View key={ensaio.id} style={styles.ensaioWrapper}>
            <CondicoesEnsaioPdf ensaio={ensaio} />

            <EnsaioTable
              title="Resistência dos Contatos (µΩ)"
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
          </View>
        );
      })}
    </View>
  );
};

export default TabelaDisjuntorMedia;
