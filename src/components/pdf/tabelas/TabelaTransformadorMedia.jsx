// src/components/pdf/tabelas/TabelaTransformadorMedia.jsx

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

const ServicosSection = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Serviços Efetuados</Text>
      <View style={styles.serviceGrid}>
        {data.map(
          (servico, index) =>
            servico.valor !== "N/A" && (
              <View key={index} style={styles.serviceItem}>
                <Text style={styles.serviceLabel}>{servico.label}:</Text>
                <Text style={styles.serviceValue}>{servico.valor}</Text>
              </View>
            )
        )}
      </View>
    </View>
  );
};

const TabelaTransformadorMedia = ({ componente, Html, stylesheet }) => {
  const relacaoColumns = [
    { key: "tap", label: "TAP" },
    { key: "faseA", label: "Fase A (V)" },
    { key: "faseB", label: "Fase B (V)" },
    { key: "faseC", label: "Fase C (V)" },
  ];
  const resistenciaOhmicaColumns = [
    { key: "tap", label: "TAP" },
    { key: "faseA", label: "Fase A (mΩ)" },
    { key: "faseB", label: "Fase B (mΩ)" },
    { key: "faseC", label: "Fase C (mΩ)" },
  ];
  const isolamentoColumns = [
    { key: "configuracao", label: "Configuração" },
    { key: "valorMedido", label: "Medido (MΩ)" },
  ];
  const fpColumns = [
    { key: "configuracao", label: "Configuração" },
    { key: "valorMedido", label: "Medido (%)" },
  ];

  return (
    <View style={styles.container}>
      {/* ============================================================================= */}
      {/* CORREÇÃO DA QUEBRA DE CABEÇALHO APLICADA AQUI */}
      {/* O cabeçalho agora é renderizado junto com o primeiro ensaio, e o 
          agrupamento com `wrap={false}` garante que eles não se separem. */}
      {/* ============================================================================= */}
      {componente.ensaios.map((ensaio, index) => (
        <View key={ensaio.id} style={styles.ensaioWrapper} break={index > 0}>
          {/* Agrupa o cabeçalho principal e as condições do ensaio */}
          <View wrap={false}>
            {/* O cabeçalho do componente só é exibido uma vez, no topo do primeiro ensaio. */}
            {index === 0 && <ComponentInfoHeaderPdf component={componente} />}
            <CondicoesEnsaioPdf ensaio={ensaio} />
          </View>

          {/* As tabelas podem quebrar entre páginas se forem muito longas */}
          <EnsaioTable
            title="Relação de Transformação"
            data={ensaio.dados?.relacaoData}
            columns={relacaoColumns}
          />
          <EnsaioTable
            title="Resistência Ôhmica dos Enrolamentos de AT"
            data={ensaio.dados?.resistenciaAT}
            columns={resistenciaOhmicaColumns}
          />
          <EnsaioTable
            title="Resistência Ôhmica dos Enrolamentos de BT"
            data={ensaio.dados?.resistenciaBT}
            columns={resistenciaOhmicaColumns}
          />
          <EnsaioTable
            title="Resistência de Isolamento"
            data={ensaio.dados?.resistenciaIsolamento}
            columns={isolamentoColumns}
          />
          <EnsaioTable
            title="Fator de Potência do Isolamento"
            data={ensaio.dados?.fatorPotencia}
            columns={fpColumns}
          />

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

export default TabelaTransformadorMedia;
