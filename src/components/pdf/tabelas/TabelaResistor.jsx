// src/components/pdf/tabelas/TabelaResistor.jsx

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
  infoTable: {
    display: "table",
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  infoRow: { flexDirection: "row", borderBottom: "1px solid #f1f5f9" },
  infoLabel: {
    width: "40%",
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: "#f8fafc",
    borderRight: "1px solid #e2e8f0",
  },
  infoValue: { width: "60%", padding: 6, fontSize: 9, textAlign: "center" },
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

const InfoRow = ({ label, value, unit = "" }) => {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{`${value} ${unit}`.trim()}</Text>
    </View>
  );
};

const TabelaResistor = ({ componente, Html, stylesheet }) => {
  return (
    <View style={styles.container}>
      {componente.ensaios.map((ensaio, index) => (
        <View key={ensaio.id} style={styles.ensaioWrapper} break={index > 0}>
          <View wrap={false}>
            {index === 0 && <ComponentInfoHeaderPdf component={componente} />}
            <CondicoesEnsaioPdf ensaio={ensaio} />
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Resistência de Aterramento</Text>
            <View style={styles.infoTable}>
              <InfoRow
                label="Resistência Nominal"
                value={ensaio.dados?.resistenciaNominal}
                unit="Ω"
              />
              <InfoRow
                label="Resistência Medida"
                value={ensaio.dados?.resistenciaMedida}
                unit="Ω"
              />
              <InfoRow
                label="Tensão Aplicada"
                value={ensaio.dados?.tensaoAplicada}
                unit="V"
              />
              <InfoRow
                label="Corrente Medida"
                value={ensaio.dados?.correnteMedida}
                unit="A"
              />
              <InfoRow
                label="Frequência"
                value={ensaio.dados?.frequencia}
                unit="Hz"
              />
            </View>
          </View>

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

export default TabelaResistor;
