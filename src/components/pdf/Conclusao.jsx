// src/components/pdf/Conclusao.jsx

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import Footer from "./Footer.jsx";

const styles = StyleSheet.create({
  // Estilos da página e título principal
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

  // Estilo para a seção de "Conclusão Geral"
  generalConclusionCard: {
    backgroundColor: "#f8fafc", // Fundo sutil (slate-50)
    border: "1px solid #e2e8f0", // Borda clara (slate-200)
    borderRadius: 4,
    padding: "15px 20px",
    marginBottom: 25,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0e7490", // Cor primária (cyan-700)
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.6, // Espaçamento entre linhas melhorado
    color: "#334155", // Cor de texto suave (slate-700)
  },

  // Estilos para as "Observações Específicas"
  observationCard: {
    borderLeft: "3px solid #0e7490", // Destaque na borda esquerda
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
    color: "#64748b", // Cor de texto secundária (slate-500)
    marginBottom: 6,
  },
  observationText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#475569", // Cor de texto (slate-600)
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

const Conclusao = ({ osData }) => {
  // A lógica para extrair observações permanece a mesma
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
    // BOOKMARK ADICIONADO AQUI
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "5. CONCLUSÃO", id: "conclusao" }}
    >
      <Text style={styles.mainTitle}>5. Conclusão</Text>

      {/* Card para a Conclusão Geral */}
      <View style={styles.generalConclusionCard}>
        <Text style={styles.subTitle}>Conclusão Geral do Serviço</Text>
        <Text style={styles.detailsText}>
          {osData.conclusao ||
            "Nenhuma conclusão geral foi informada para esta Ordem de Serviço."}
        </Text>
      </View>

      {/* Seção para as Observações Específicas */}
      <View>
        <Text style={styles.subTitle}>
          Observações Específicas dos Equipamentos
        </Text>
        {specificObservations.length > 0 ? (
          specificObservations.map((item, index) => (
            // Cada observação agora é um "card" visualmente distinto
            <View key={index} style={styles.observationCard}>
              <Text style={styles.equipmentName}>{item.componenteNome}</Text>
              <Text style={styles.substationName}>
                Subestação: {item.subestacaoNome}
              </Text>
              <Text style={styles.observationText}>"{item.observacao}"</Text>
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
