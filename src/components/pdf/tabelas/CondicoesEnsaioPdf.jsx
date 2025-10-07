// frontend/src/components/pdf/tabelas/CondicoesEnsaioPdf.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "../../../utils/helpers"; // Importar o helper de formatação de data

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Roboto",
    padding: 5,
    color: "#555555",
  },
  row: {
    flexDirection: "row",
    border: "1px solid #eeeeee",
    borderTopWidth: 0,
  },
  cellLabel: {
    width: "40%",
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: "#f8f8f8",
    borderRight: "1px solid #eeeeee",
  },
  cellValue: {
    width: "60%",
    padding: 5,
    fontSize: 9,
    textAlign: "center",
  },
});

// O componente agora recebe o objeto 'ensaio' completo
const CondicoesEnsaioPdf = ({ ensaio }) => {
  const ensaioData = ensaio?.dados || {};
  const responsavelNome = ensaio?.responsavel?.nome || "Não informado";

  // Verifica se existe alguma informação para ser renderizada
  if (
    !ensaioData.temperatura &&
    !ensaioData.umidade &&
    !ensaioData.frequencia &&
    !ensaio.dataEnsaio
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>CONDIÇÕES DO ENSAIO</Text>
      <View style={{ border: "1px solid #eeeeee", borderRadius: 3 }}>
        {/* DATA DO ENSAIO (NOVO) */}
        <View style={[styles.row, { borderTopWidth: 1 }]}>
          <Text style={styles.cellLabel}>Data do Ensaio</Text>
          <Text style={styles.cellValue}>
            {ensaio.dataEnsaio ? formatDate(ensaio.dataEnsaio) : "N/A"}
          </Text>
        </View>
        {/* RESPONSÁVEL (NOVO) */}
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Responsável pelo Ensaio</Text>
          <Text style={styles.cellValue}>{responsavelNome}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.cellLabel}>Temperatura Ambiente (°C)</Text>
          <Text style={styles.cellValue}>
            {ensaioData.temperatura || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Umidade Relativa do Ar (%)</Text>
          <Text style={styles.cellValue}>{ensaioData.umidade || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Frequência (Hz)</Text>
          <Text style={styles.cellValue}>{ensaioData.frequencia || "N/A"}</Text>
        </View>
      </View>
    </View>
  );
};

export default CondicoesEnsaioPdf;
