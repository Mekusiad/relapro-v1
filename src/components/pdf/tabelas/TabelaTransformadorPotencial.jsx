// src/components/pdf/tabelas/TabelaTransformadorPotencial.jsx

import React from "react";
// A CORREÇÃO ESTÁ AQUI: removido o hífen extra.
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import ComponentInfoHeaderPdf from "./ComponentInfoHeaderPdf.jsx";
import CondicoesEnsaioPdf from "./CondicoesEnsaioPdf.jsx";

// --- ESTILOS ---
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
    padding: 5,
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

const EnsaioTable = ({ title, data, columns }) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.section} wrap={false}>
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
            key={row.id || rowIndex}
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

const TabelaTransformadorPotencial = ({ componente, Html, stylesheet }) => {
  const relacaoColumns = [
    { key: "numSerie", label: "Nº Série" },
    { key: "tensaoAT", label: "Tensão AT (V)" },
    { key: "tensaoBT", label: "Tensão BT (V)" },
    { key: "terminais1", label: "Terminais Prim." },
    { key: "terminais2", label: "Terminais Sec." },
    { key: "relacaoCalc", label: "Relação Calc." },
    { key: "relacaoMed", label: "Relação Med." },
    { key: "exatidao", label: "Exatidão (%)" },
  ];
  const isolamentoColumns = [
    { key: "numSerie", label: "Nº Série" },
    { key: "terminais", label: "Terminais" },
    { key: "medido", label: "Medido (MΩ)" },
    { key: "temperatura", label: "Temp. (°C)" },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />

      {componente.ensaios.map((ensaio) => (
        <View key={ensaio.id} style={styles.ensaioWrapper}>
          <CondicoesEnsaioPdf ensaio={ensaio} />

          <EnsaioTable
            title="Relação de Transformação"
            data={ensaio.dados?.relacaoData}
            columns={relacaoColumns}
          />
          <EnsaioTable
            title="Resistência de Isolamento"
            data={ensaio.dados?.resistenciaIsolamento}
            columns={isolamentoColumns}
          />

          {(ensaio.dados?.observacoes || ensaio.dados?.naoConforme) && (
            <View style={styles.diagnosisSection} wrap={false}>
              <Text style={styles.subtitle}>
                Observações e Diagnóstico do Ensaio
              </Text>
              {ensaio.dados.observacoes && (
                <Text style={styles.obsText}>"{ensaio.dados.observacoes}"</Text>
              )}
              {ensaio.dados.naoConforme && (
                <View
                  style={[
                    styles.obsText,
                    { marginTop: ensaio.dados.observacoes ? 8 : 0 },
                  ]}
                >
                  <Text style={styles.obsLabel}>Diagnóstico: </Text>
                  {Html && stylesheet ? (
                    <Html stylesheet={stylesheet}>
                      {ensaio.dados.naoConformeDetalhes || "Não Conforme"}
                    </Html>
                  ) : (
                    <Text style={styles.nonConformityText}>
                      {ensaio.dados.naoConformeDetalhes || "Não Conforme"}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default TabelaTransformadorPotencial;
