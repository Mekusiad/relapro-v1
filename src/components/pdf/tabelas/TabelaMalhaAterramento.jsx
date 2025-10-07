// src/components/pdf/tabelas/TabelaMalhaAterramento.jsx

import React from "react";
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

const MeasurementTable = ({ data }) => {
  if (!data) return null;
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>Medição da Resistência</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableColHeader, flex: 2 }}>
            Valor Medido (Ω)
          </Text>
          <Text style={{ ...styles.tableColHeader, flex: 2 }}>
            Estratificação do Solo
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableCol, flex: 2 }}>
            {data?.valorResistencia || "N/A"}
          </Text>
          <Text style={{ ...styles.tableCol, flex: 2 }}>
            {data?.estratificacao || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ServicosSection = ({ data }) => {
  if (!data) return null;
  const servicos = Object.entries(data).filter(
    ([_, value]) => value && value !== "N/A"
  );
  if (servicos.length === 0) return null;

  const serviceLabels = {
    servicoCaixas: "Inspeção das caixas",
    servicoCaptores: "Integridade dos captores",
  };

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>Serviços Efetuados</Text>
      <View style={styles.serviceGrid}>
        {servicos.map(([key, value]) => (
          <View key={key} style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>
              {serviceLabels[key] || key}:
            </Text>
            <Text style={styles.serviceValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TabelaMalhaAterramento = ({ componente, Html, stylesheet }) => {
  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />

      {componente.ensaios.map((ensaio) => (
        <View key={ensaio.id} style={styles.ensaioWrapper}>
          <CondicoesEnsaioPdf ensaio={ensaio} />

          <MeasurementTable data={ensaio.dados} />
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

export default TabelaMalhaAterramento;
