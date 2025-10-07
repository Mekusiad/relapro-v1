// src/components/pdf/tabelas/TabelaTransformadorAlta.jsx

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

const ServicosSection = ({ data }) => {
  // Garante que 'data' é um array antes de chamar o .filter
  const servicos = (data || []).filter((s) => s.valor && s.valor !== "N/A");
  if (servicos.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Serviços Efetuados</Text>
      <View style={styles.serviceGrid}>
        {servicos.map((servico, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>{servico.label}:</Text>
            <Text style={styles.serviceValue}>{servico.valor}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TabelaTransformadorAlta = ({ componente, Html, stylesheet }) => {
  const relacaoColumns = [
    { key: "tap", label: "TAP" },
    { key: "tensaoAplicada", label: "Tensão Aplicada (V)" },
    { key: "faseA", label: "Fase A (V)" },
    { key: "faseB", label: "Fase B (V)" },
    { key: "faseC", label: "Fase C (V)" },
  ];
  const resistenciaOhmicaColumns = [
    { key: "tap", label: "TAP" },
    { key: "enrolamento", label: "Enrolamento" },
    { key: "faseA", label: "Fase A (mΩ)" },
    { key: "faseB", label: "Fase B (mΩ)" },
    { key: "faseC", label: "Fase C (mΩ)" },
  ];
  const isolamentoColumns = [
    { key: "configuracao", label: "Configuração" },
    { key: "tensao", label: "Tensão (V)" },
    { key: "tempo", label: "Tempo (s)" },
    { key: "valorMedido", label: "Valor Medido (MΩ)" },
  ];
  const fpTrafoColumns = [
    { key: "enrolamento", label: "Enrolamento" },
    { key: "modo", label: "Modo" },
    { key: "valorMedido", label: "Medido (%)" },
  ];
  const fpBuchaColumns = [
    { key: "bucha", label: "Bucha" },
    { key: "modo", label: "Modo" },
    { key: "valorMedido", label: "Medido (%)" },
  ];
  const excitacaoColumns = [
    { key: "tap", label: "TAP" },
    { key: "tensao", label: "Tensão (V)" },
    { key: "correnteA", label: "Corrente A (mA)" },
    { key: "correnteB", label: "Corrente B (mA)" },
    { key: "correnteC", label: "Corrente C (mA)" },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />

      {componente.ensaios.map((ensaio) => {
        const ensaioData = ensaio.dados || {};
        return (
          // A propriedade `wrap` foi removida deste View principal
          <View key={ensaio.id} style={styles.ensaioWrapper}>
            <CondicoesEnsaioPdf ensaio={ensaio} />

            <EnsaioTable
              title="Relação de Transformação"
              data={ensaioData.relacaoData}
              columns={relacaoColumns}
            />
            <EnsaioTable
              title="Resistência Ôhmica dos Enrolamentos"
              data={ensaioData.resistenciaData}
              columns={resistenciaOhmicaColumns}
            />
            <EnsaioTable
              title="Resistência de Isolamento (MΩ)"
              data={ensaioData.isolamentoData}
              columns={isolamentoColumns}
            />
            <EnsaioTable
              title="Fator de Potência do Isolamento do Transformador à 10kV"
              data={ensaioData.fpTrafoData}
              columns={fpTrafoColumns}
            />
            <EnsaioTable
              title="Fator de Potência de Isolamento das Buchas 10kV"
              data={ensaioData.fpBuchaData}
              columns={fpBuchaColumns}
            />
            <EnsaioTable
              title="Ensaio de Corrente de Excitação"
              data={ensaioData.excitacaoData}
              columns={excitacaoColumns}
            />

            <ServicosSection data={ensaioData.servicos} />

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

export default TabelaTransformadorAlta;
