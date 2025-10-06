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

  const servicos = [
    { label: "Inspeção visual geral", key: "inspecaoVisual" },
    { label: "Limpeza a seco", key: "limpezaSeco" },
    { label: "Reaperto de conexões", key: "reapertoConexoes" },
    { label: "Inspeção de fiação", key: "inspecaoFios" },
  ];

  return (
    <View style={[styles.section, { marginTop: 15 }]}>
      <Text style={styles.subtitle}>Serviços Executados</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <Text style={[styles.tableColHeader, { flex: 3 }]}>Serviço</Text>
          <Text style={[styles.tableColHeader, { flex: 1 }]}>Resultado</Text>
        </View>
        {servicos.map((servico) => (
          <View key={servico.key} style={styles.tableRow}>
            <Text style={[styles.tableCol, { flex: 3, textAlign: "left" }]}>
              {servico.label}
            </Text>
            <Text style={[styles.tableCol, { flex: 1 }]}>
              {data[servico.key]?.toUpperCase() || "N/A"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TabelaBancoDeBaterias = ({ componente, Html, stylesheet }) => {
  const tensaoColumns = [
    { key: "id", label: "Bateria N°", width: 1 },
    { key: "tensao", label: "Valor Medido (Vcc)", width: 2 },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />
      {componente.ensaios.map((ensaio) => {
        const tensaoTotal = (ensaio.dados?.tabelaData || [])
          .reduce(
            (sum, row) =>
              sum + (parseFloat(String(row.tensao).replace(",", ".")) || 0),
            0
          )
          .toFixed(2);

        return (
          <View key={ensaio.id} style={styles.ensaioWrapper} wrap={true}>
            <CondicoesEnsaioPdf ensaio={ensaio} />

            <View style={styles.section} wrap={false}>
              <Text
                style={styles.subtitle}
              >{`Tensão de Flutuação Individual (Total: ${tensaoTotal} V)`}</Text>
            </View>

            {/* A tabela em si não permite quebra de página interna */}
            <View style={styles.table} wrap={false}>
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
              {(ensaio.dados?.tabelaData || []).map((row, index) => (
                <View key={index} style={styles.tableRow}>
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

            {/* Cada uma destas secções pode agora quebrar a página antes de ser renderizada */}
            <ServicosSection data={ensaio.dados?.servicos} />

            {(ensaio.dados?.observacoes || ensaio.dados?.naoConforme) && (
              <View style={styles.diagnosisSection} wrap={true}>
                <Text style={styles.subtitle} wrap={false}>
                  Observações e Diagnóstico do Ensaio
                </Text>
                {ensaio.dados.observacoes && (
                  <Text style={styles.obsText} wrap={false}>
                    "{ensaio.dados.observacoes}"
                  </Text>
                )}
                {ensaio.dados.naoConforme && (
                  <View
                    style={[
                      styles.obsText,
                      { marginTop: ensaio.dados.observacoes ? 8 : 0 },
                    ]}
                    wrap={false}
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
        );
      })}
    </View>
  );
};

export default TabelaBancoDeBaterias;
