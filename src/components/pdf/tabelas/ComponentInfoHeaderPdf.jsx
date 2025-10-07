// src/components/pdf/tabelas/ComponentInfoHeaderPdf.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: 3,
    padding: "8px 10px",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1px solid #e9ecef",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  field: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
    paddingBottom: 3,
  },
  label: { fontSize: 8, fontWeight: "bold", color: "#6c757d", width: "40%" },
  value: { fontSize: 8, color: "#212529", width: "60%" },
});

const InfoField = ({ label, value }) => {
  if (!value && value !== 0) return null; // Não renderiza se o valor for nulo ou indefinido
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
};

const ComponentInfoHeaderPdf = ({ component }) => {
  if (!component) return null;
  // Acessa o objeto 'info' que vem do backend de forma segura
  const info = component.info || {};

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>
        {component.nomeEquipamento || "Nome não informado"}
      </Text>
      <View style={styles.grid}>
        {/* Adicionados TODOS os campos possíveis para garantir que apareçam */}
        <InfoField label="Subestação" value={component.subestacaoNome} />
        <InfoField label="Localização" value={info.localizacao} />
        <InfoField label="TAG" value={info.tag} />
        <InfoField label="Fabricante" value={info.fabricante} />
        <InfoField label="Nº de Série" value={info.numeroSerie} />
        <InfoField label="Modelo" value={info.modelo} />
        <InfoField label="Ano Fabricação" value={info.anoFabricacao} />
        <InfoField label="Potência" value={info.potencia} />
        <InfoField label="Tensão Nominal" value={info.tensaoNominal} />
        <InfoField label="Tensão Primário" value={info.tensaoPrimario} />
        <InfoField label="Tensão Secundário" value={info.tensaoSecundario} />
        <InfoField label="Corrente Nominal" value={info.correnteNominal} />
        <InfoField label="Corrente Primário" value={info.correntePrimario} />
        <InfoField
          label="Corrente Secundário"
          value={info.correnteSecundario}
        />
        <InfoField label="Meio Isolante" value={info.meioIsolante} />
        <InfoField label="Volume Óleo" value={info.volumeOleoIsolante} />
        <InfoField label="Massa Total" value={info.massaTotal} />
        <InfoField label="Impedância" value={info.impedancia} />
        <InfoField label="Frequência" value={info.frequencia} />
        <InfoField label="Exatidão" value={info.exatidao} />
        <InfoField label="Curto-Circuito" value={info.curtoCircuito} />
        <InfoField label="Circuito" value={info.circuito} />
        <InfoField label="Pressão" value={info.pressao} />
        <InfoField label="Seção do Cabo" value={info.secaoCabo} />
      </View>
    </View>
  );
};

export default ComponentInfoHeaderPdf;
