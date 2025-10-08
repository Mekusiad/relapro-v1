// src/components/pdf/tabelas/TabelaPararaios.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import ComponentInfoHeaderPdf from "./ComponentInfoHeaderPdf.jsx";
import EnsaioEquipamentosPdf from "./EnsaioEquipamentosPdf.jsx";
import EnsaioFotosPdf from "./EnsaioFotosPdf.jsx";
import CondicoesEnsaioPdf from "./CondicoesEnsaioPdf.jsx";

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

const TabelaPararaios = ({ componente, Html, stylesheet }) => {
  const resistenciaColumns = [
    { key: "fase", label: "Fase" },
    { key: "numeroSerie", label: "Nº Série" },
    { key: "tensaoEnsaio", label: "Tensão Ensaio (V)" },
    { key: "valorMedido", label: "Valor Medido (MΩ)" },
    { key: "valorReferencia", label: "Valor Ref. (MΩ)" },
    { key: "tempo", label: "Tempo (s)" },
  ];
  const fugaColumns = [
    { key: "fase", label: "Fase" },
    { key: "numeroSerie", label: "Nº Série" },
    { key: "tensaoEnsaio", label: "Tensão Ensaio (V)" },
    { key: "valorMedido", label: "Valor Medido (µA)" },
    { key: "valorReferencia", label: "Valor Ref. (µA)" },
    { key: "tempo", label: "Tempo (s)" },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />

      {componente.ensaios.map((ensaio) => {
        const ensaioData = ensaio.dados || {};
        return (
          <View key={ensaio.id} style={styles.ensaioWrapper}>
            <CondicoesEnsaioPdf ensaio={ensaio} />
            <EnsaioTable
              title="Resistência de Isolamento"
              data={ensaioData.resistenciaIsolamento}
              columns={resistenciaColumns}
            />
            <EnsaioTable
              title="Corrente de Fuga"
              data={ensaioData.correnteFuga}
              columns={fugaColumns}
            />

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

export default TabelaPararaios;
