// src/components/pdf/Conclusao.jsx

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
  generalConclusionCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "15px 20px",
    marginBottom: 25,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0e7490",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.6,
    color: "#334155",
  },
  observationCard: {
    borderLeft: "3px solid #0e7490",
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
  observationText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#475569",
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

// --- CORREÇÃO APLICADA AQUI ---
// O componente agora aceita a prop 'bookmarkId' para manter a consistência.
const Conclusao = ({ osData, bookmarkId }) => {
  const specificObservations = [];
  osData.subestacoes?.forEach((sub) => {
    sub.componentes?.forEach((comp) => {
      comp.ensaios?.forEach((ensaio) => {
        if (ensaio.dados?.observacoes) {
          specificObservations.push({
            subestacaoNome: sub.nome,
            componenteNome: comp.nomeEquipamento,
            observacao: ensaio.dados.observacoes,
          });
        }
      });
    });
  });

  return (
    // O 'id' do bookmark agora usa a prop 'bookmarkId'.
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "Conclusão", id: bookmarkId }}
    >
      <Text style={styles.mainTitle}>5. Conclusão</Text>
      <View style={styles.generalConclusionCard}>
        <Text style={styles.subTitle}>Conclusão Geral do Serviço</Text>
        <Text style={styles.detailsText}>
          {osData.conclusao ||
            "Nenhuma conclusão geral foi informada para esta Ordem de Serviço."}
        </Text>
      </View>
      <View>
        <Text style={styles.subTitle}>
          Observações Específicas dos Equipamentos
        </Text>
        {specificObservations.length > 0 ? (
          specificObservations.map((item, index) => (
            <View key={index} style={styles.observationCard}>
              <Text style={styles.equipmentName}>{item.componenteNome}</Text>
              <Text style={styles.substationName}>
                Subestação: {item.subestacaoNome}
              </Text>
              <Text style={styles.observationText}>"{item.observation}"</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>
            Nenhuma observação específica foi registrada durante os ensaios dos
            equipamentos.
          </Text>
        )}
      </View>
      <Footer />
    </Page>
  );
};

export default Conclusao;
