// src/components/pdf/DadosDaOS.jsx

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDate, translateStatus } from "../../utils/helpers";
import Footer from "./Footer.jsx";

const styles = StyleSheet.create({
  page: {
    padding: "40px 40px 60px 40px",
    fontFamily: "Roboto",
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#164e63", // Cor ciano escuro
    textAlign: "center",
    padding: "12px 0",
    borderRadius: 4,
    marginBottom: 25,
  },
  // Grid principal com duas colunas
  grid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  column: {
    flex: 1,
    gap: 20, // Espaço entre os cards na mesma coluna
  },
  // Estilo do Card
  card: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "12px 15px",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0e7490",
    marginBottom: 12,
  },
  // Item de informação (Label + Valor)
  infoItem: {
    flexDirection: "row",
    marginBottom: 7,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
    width: "40%",
  },
  infoValue: {
    fontSize: 9,
    color: "#334155",
    width: "60%",
  },
  // Descrição/Observações (ocupa a largura total)
  fullWidthCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "12px 15px",
    marginTop: 5,
  },
  fullWidthText: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.5,
    color: "#334155",
  },
});

// Componente auxiliar para um item de informação
const InfoItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const DadosDaOS = ({ osData, allTechnicians, bookmarkId }) => {
  const tecnicosNomes = osData.tecnicos
    ?.map((t) => allTechnicians.find((tech) => tech.id === t)?.nome)
    .filter(Boolean)
    .join(", ");

  return (
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "Dados da OS", id: bookmarkId }}
    >
      <Text style={styles.mainTitle}>1. Dados da Ordem de Serviço</Text>

      <View style={styles.grid}>
        {/* Coluna da Esquerda */}
        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dados do Cliente</Text>
            <InfoItem label="Empresa" value={osData.cliente?.nome} />
            <InfoItem label="CNPJ" value={osData.cliente?.cnpj} />
            <InfoItem label="Endereço" value={osData.cliente?.endereco} />
            <InfoItem label="Contato (A/C)" value={osData.responsavel} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Equipe Responsável</Text>
            <InfoItem label="Engenheiro" value={osData.engenheiro?.nome} />
            <InfoItem label="Supervisor" value={osData.supervisor?.nome} />
            <InfoItem label="Técnicos" value={tecnicosNomes} />
          </View>
        </View>

        {/* Coluna da Direita */}
        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalhes da OS</Text>
            <InfoItem label="Nº da OS" value={osData.numeroOs} />
            <InfoItem label="Nº Orçamento" value={osData.numeroOrcamento} />
            <InfoItem label="Status" value={translateStatus(osData.status)} />
            <InfoItem
              label="Tipo de Serviço"
              value={osData.tipoServico?.replace(/_/g, " ")}
            />
            <InfoItem
              label="Início Previsto"
              value={formatDate(osData.previsaoInicio)}
            />
          </View>
        </View>
      </View>

      {/* Seção de Descrição (abaixo das colunas) */}
      <View style={styles.fullWidthCard}>
        <Text style={styles.cardTitle}>Descrição Inicial dos Serviços</Text>
        <Text style={styles.fullWidthText}>
          {osData.descricaoInicial || "Nenhuma descrição fornecida."}
        </Text>
      </View>

      <Footer />
    </Page>
  );
};

export default DadosDaOS;
