// src/components/pdf/Recomendacoes.jsx

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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
    backgroundColor: "#164e63",
    textAlign: "center",
    padding: "12px 0",
    borderRadius: 4,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0e7490",
    marginBottom: 15,
  },
  // Card para Recomendações Gerais
  generalCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "15px 20px",
    marginBottom: 25,
  },
  // Card para item de Não Conformidade
  itemCard: {
    borderLeft: "3px solid #be123c", // Destaque em vermelho (rose-700)
    padding: "12px 15px",
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 3,
  },
  equipmentName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
  },
  substationName: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#64748b",
    marginBottom: 6,
  },
  detailsText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#334155",
    textAlign: "justify",
  },
  noItemsText: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#64748b",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    border: "1px dashed #e2e8f0",
  },
});

const Recomendacoes = ({ osData, bookmarkId }) => {
  const nonConformities = [];
  osData.subestacoes?.forEach((sub) => {
    sub.componentes?.forEach((comp) => {
      comp.ensaios?.forEach((ensaio) => {
        if (ensaio.dados?.naoConforme && ensaio.dados?.naoConformeDetalhes) {
          nonConformities.push({
            subestacaoNome: sub.nome,
            componenteNome: comp.nomeEquipamento,
            detalhes: ensaio.dados.naoConformeDetalhes,
          });
        }
      });
    });
  });

  const generalRecommendations = osData.recomendacoes;

  // Não renderiza a página se não houver NENHUMA recomendação ou não conformidade
  if (nonConformities.length === 0 && !generalRecommendations) {
    return null;
  }

  return (
    <Page
      size="A4"
      style={styles.page}
      id={bookmarkId}
      bookmark={{ title: "Recomendações", id: bookmarkId }}
    >
      <Text style={styles.mainTitle}>2. Recomendações Técnicas</Text>

      <View>
        <Text style={styles.sectionTitle}>
          Pontos de Não Conformidade Identificados
        </Text>
        {nonConformities.length > 0 ? (
          nonConformities.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.equipmentName}>{item.componenteNome}</Text>
              <Text style={styles.substationName}>
                Subestação: {item.subestacaoNome}
              </Text>
              <Text style={styles.detailsText}>{item.detalhes}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>
            Nenhum ponto de não conformidade foi registrado.
          </Text>
        )}
      </View>

      {generalRecommendations && (
        <View style={styles.generalCard}>
          <Text style={styles.sectionTitle}>Recomendações Gerais</Text>
          <Text style={styles.detailsText}>{generalRecommendations}</Text>
        </View>
      )}

      <Footer />
    </Page>
  );
};

export default Recomendacoes;
