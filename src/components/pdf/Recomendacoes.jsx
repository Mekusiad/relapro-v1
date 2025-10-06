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
  contentText: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.6,
    color: "#334155",
  },
  // Adicione mais estilos conforme necessário
});

const Recomendacoes = ({ osData }) => {
  // Lógica para extrair as recomendações
  const naoConformidades = [];
  osData.subestacoes?.forEach((sub) => {
    sub.componentes?.forEach((comp) => {
      comp.ensaios?.forEach((ensaio) => {
        if (ensaio.dados?.naoConforme && ensaio.dados?.naoConformeDetalhes) {
          naoConformidades.push({
            componente: `${comp.nomeEquipamento} (${comp.tag})`,
            detalhes: ensaio.dados.naoConformeDetalhes,
          });
        }
      });
    });
  });

  return (
    // BOOKMARK ADICIONADO AQUI
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "2. RECOMENDAÇÕES TÉCNICAS", id: "recomendacoes" }}
    >
      <Text style={styles.mainTitle}>2. Recomendações Técnicas</Text>

      <View>
        <Text style={styles.contentText}>
          {osData.recomendacoes || "Nenhuma recomendação geral foi fornecida."}
        </Text>
      </View>

      {naoConformidades.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
            Não Conformidades Encontradas:
          </Text>
          {naoConformidades.map((item, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                {item.componente}:
              </Text>
              <Text style={styles.contentText}>- {item.detalhes}</Text>
            </View>
          ))}
        </View>
      )}

      <Footer />
    </Page>
  );
};

export default Recomendacoes;
