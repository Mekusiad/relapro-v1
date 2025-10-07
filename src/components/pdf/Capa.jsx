// src/components/pdf/Capa.jsx

import React from "react";
// CORREÇÃO: Removido o hífen extra. O correto é '@react-pdf/renderer'
import {
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { formatDate } from "../../utils/helpers.js";
import { SERVICE_TYPE_NAMES } from "../../services/pdfService.jsx";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Roboto",
  },
  // --- Painel Esquerdo (Escuro) ---
  leftPanel: {
    width: "30%",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: "40px 25px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  companyHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 64,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: "#14b8a6",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: { fontSize: 24, fontWeight: "bold", letterSpacing: 2 },
  reportType: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "#5eead4",
    marginBottom: 8,
  },
  reportTitle: { fontSize: 24, fontWeight: "heavy", lineHeight: 1.1 },
  leftFooter: { fontSize: 10, color: "#94a3b8" },

  // --- Painel Direito (Claro com Fundo) ---
  rightPanel: {
    width: "70%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    opacity: 0.75,
  },
  rightContent: {
    position: "relative",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 32,
  },

  // Estilos do texto
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  accentedBlock: {
    borderLeftWidth: 4,
    borderLeftColor: "#14b8a6",
    paddingLeft: 16,
  },
  clientName: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },
  clientDetails: { fontSize: 12, color: "#334155", marginTop: 4 },
  contactItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    fontSize: 11,
    color: "#1e293b",
    marginBottom: 8,
  },
  contactIcon: { width: 14, height: 14, color: "#64748b" },
  dateValue: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
});

// Ícones SVG
const LightningIcon = () => (
  <Svg style={{ width: 24, height: 24, color: "#ffffff" }} viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </Svg>
);
const UserIcon = () => (
  <Svg style={styles.contactIcon} viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </Svg>
);
const EmailIcon = () => (
  <Svg style={styles.contactIcon} viewBox="0 0 20 20">
    <Path
      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
      fill="currentColor"
    />
    <Path
      d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
      fill="currentColor"
    />
  </Svg>
);

const Capa = ({ osData, bookmarkId }) => {
  if (!osData)
    return (
      <Page>
        <Text>Dados da Ordem de Serviço não encontrados.</Text>
      </Page>
    );

  const serviceName =
    SERVICE_TYPE_NAMES[osData.tipoServico] || "Relatório de Serviço";
  const serviceDate = formatDate(osData.previsaoInicio);
  const clientName = osData.cliente?.nome || "Cliente não informado";

  return (
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "Capa", id: bookmarkId }}
    >
      {/* Painel Esquerdo */}
      <View style={styles.leftPanel}>
        <View>
          <View style={styles.companyHeader}>
            <View style={styles.logoPlaceholder}>
              <LightningIcon />
            </View>
            <Text style={styles.companyName}>ITAM</Text>
          </View>
          <View>
            <Text style={styles.reportType}>Relatório de Serviços</Text>
            <Text style={styles.reportTitle}>{serviceName}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.leftFooter}>
            Orçamento N°: {osData.numeroOrcamento || "N/A"}
          </Text>
          <Text style={styles.leftFooter}>OS N°: {osData.numeroOs}</Text>
        </View>
      </View>

      {/* Painel Direito */}
      <View style={styles.rightPanel}>
        {/* <Image style={styles.backgroundImage} src="/cover-bg.jpeg" /> */}
        <View style={styles.overlay} />
        <View style={styles.rightContent}>
          {/* Seção Cliente */}
          <View>
            <Text style={styles.sectionTitle}>Preparado para</Text>
            <View style={styles.accentedBlock}>
              <Text style={styles.clientName}>{clientName}</Text>
              <Text style={styles.clientDetails}>
                {osData.descricaoInicial || "Serviços de Manutenção"}
              </Text>
            </View>
          </View>
          {/* Seção Contato */}
          <View>
            <Text style={styles.sectionTitle}>Contato</Text>
            <View style={styles.accentedBlock}>
              {osData.responsavel && (
                <View style={styles.contactItem}>
                  <UserIcon />
                  <Text>{osData.responsavel}</Text>
                </View>
              )}
              {osData.cliente?.contato && (
                <View style={styles.contactItem}>
                  <EmailIcon />
                  <Text>{osData.cliente.contato}</Text>
                </View>
              )}
            </View>
          </View>
          {/* Seção Data */}
          <View>
            <Text style={styles.sectionTitle}>Data de Realização</Text>
            <View style={styles.accentedBlock}>
              <Text style={styles.dateValue}>{serviceDate}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default Capa;
