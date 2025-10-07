// src/components/pdf/tabelas/TabelaBancoDeBaterias.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import ComponentInfoHeaderPdf from "./ComponentInfoHeaderPdf.jsx";
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
  tableHeader: { backgroundColor: "#f1f5f9" },
  tableColHeader: {
    flex: 1,
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
  diagnosisSection: { marginTop: 12 },
  obsText: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#475569",
    backgroundColor: "#f8fafc",
    padding: "8px 12px",
    borderRadius: 4,
    borderLeft: "3px solid #cbd5e1",
  },
  obsLabel: { fontWeight: "bold", color: "#1e293b" },
  nonConformityText: { color: "#be123c", fontWeight: "bold" },
});

const ServicosSection = ({ data }) => {
  if (!data) return null;
  const servicos = Object.entries(data).filter(
    ([_, value]) => value && value !== "N/A"
  );
  if (servicos.length === 0) return null;

  const serviceLabels = {
    inspecaoVisualGeral: "Inspeção visual geral",
    limpezaSeco: "Limpeza a seco",
    reapertoConexoes: "Reaperto de conexões",
    inspecaoFiacao: "Inspeção de fiação",
  };

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>Serviços Executados</Text>
      {servicos.map(([key, value]) => (
        <Text key={key} style={{ fontSize: 9, marginBottom: 4 }}>
          - {serviceLabels[key] || key}: {value}
        </Text>
      ))}
    </View>
  );
};

const TabelaBancoDeBaterias = ({ componente, Html, stylesheet }) => {
  const tensaoColumns = [
    { key: "bateria", label: "Bateria", width: 1 },
    { key: "valorMedido", label: "Valor Medido (Vcc)", width: 2 },
    { key: "valorReferencia", label: "Ref. (2,22 a 2,27 Vcc)", width: 2.5 },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />
      {componente.ensaios.map((ensaio) => (
        <View key={ensaio.id} style={styles.ensaioWrapper}>
          <CondicoesEnsaioPdf ensaio={ensaio} />

          <View style={styles.section} wrap={false}>
            <Text
              style={styles.subtitle}
            >{`Tensão de Flutuação Individual (Total: ${
              ensaio.dados?.tensaoTotal || "N/A"
            } V)`}</Text>
          </View>

          {/* A tabela agora pode quebrar */}
          <View style={styles.table}>
            {/* O cabeçalho fica fixo no topo da página se a tabela quebrar */}
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              {tensaoColumns.map((col) => (
                <Text
                  key={col.key}
                  style={[styles.tableColHeader, { flex: col.width || 1 }]}
                >
                  {col.label}
                </Text>
              ))}
            </View>
            {/* As linhas da tabela podem quebrar */}
            {(ensaio.dados?.tabelaData || []).map((row, index) => (
              <View key={index} style={styles.tableRow} wrap={false}>
                {tensaoColumns.map((col) => (
                  <Text
                    key={col.key}
                    style={[styles.tableCol, { flex: col.width || 1 }]}
                  >
                    {row[col.key] || "N/A"}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          <ServicosSection data={ensaio.dados?.servicos} />

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

export default TabelaBancoDeBaterias;
