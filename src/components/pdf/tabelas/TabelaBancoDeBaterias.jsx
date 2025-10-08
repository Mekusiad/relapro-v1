// src/components/pdf/tabelas/TabelaBancoDeBaterias.jsx

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

const TabelaBancoDeBaterias = ({ componente, Html, stylesheet }) => {
  // ==================================================================
  // ALTERAÇÃO 1: Definição de colunas simplificada
  // ==================================================================
  const tensaoColumns = [
    { key: "bateria", label: "Bateria", width: 1 },
    { key: "valorMedido", label: "Valor Medido (Vcc)", width: 2 },
  ];

  return (
    <View style={styles.container}>
      <ComponentInfoHeaderPdf component={componente} />
      {componente.ensaios.map((ensaio) => {
        const tabelaDeTensoes = ensaio.dados?.tabelaData || [];
        const tensaoTotalCalculada = tabelaDeTensoes
          .reduce((soma, linha) => {
            const valorNumerico =
              parseFloat(String(linha.tensao).replace(",", ".")) || 0;
            return soma + valorNumerico;
          }, 0)
          .toFixed(2);

        return (
          <View key={ensaio.id} style={styles.ensaioWrapper}>
            <CondicoesEnsaioPdf ensaio={ensaio} />

            <View style={styles.section} wrap={false}>
              <Text
                style={styles.subtitle}
              >{`Tensão de Flutuação Individual (Total: ${tensaoTotalCalculada} V)`}</Text>
            </View>

            <View style={styles.table}>
              {/* Cabeçalho da Tabela */}
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

              {/* Corpo da Tabela */}
              {tabelaDeTensoes.map((row, index) => (
                <View
                  key={row.id || index}
                  style={styles.tableRow}
                  wrap={false}
                >
                  {/* Coluna Bateria */}
                  <Text
                    style={[
                      styles.tableCol,
                      { flex: tensaoColumns[0].width || 1 },
                    ]}
                  >
                    {row.id || "N/A"}
                  </Text>
                  {/* Coluna Valor Medido */}
                  <Text
                    style={[
                      styles.tableCol,
                      { flex: tensaoColumns[1].width || 1 },
                    ]}
                  >
                    {row.tensao || "N/A"}
                  </Text>
                </View>
              ))}

              {/* ================================================================== */}
              {/* ALTERAÇÃO 2: Rodapé da tabela com o total */}
              {/* ================================================================== */}
              <View style={[styles.tableRow, styles.tableFooter]} fixed>
                <Text
                  style={[
                    styles.tableCol,
                    { flex: tensaoColumns[0].width || 1, fontWeight: "bold" },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    { flex: tensaoColumns[1].width || 1, fontWeight: "bold" },
                  ]}
                >
                  {tensaoTotalCalculada}
                </Text>
              </View>
              {/* ================================================================== */}
            </View>

            <ServicosSection data={ensaio.dados?.servicos} />

            {(ensaio.dados?.observacoes || ensaio.dados?.naoConforme) && (
              <View style={styles.diagnosisSection} wrap={false}>
                <Text style={styles.subtitle}>
                  Observações e Diagnóstico do Ensaio
                </Text>
                {ensaio.dados.observacoes && (
                  <Text style={styles.obsText}>
                    "{ensaio.dados.observacoes}"
                  </Text>
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
            <EnsaioEquipamentosPdf equipamentos={ensaio.equipamentos} />
            <EnsaioFotosPdf fotos={ensaio.fotos} />
          </View>
        );
      })}
    </View>
  );
};

export default TabelaBancoDeBaterias;
