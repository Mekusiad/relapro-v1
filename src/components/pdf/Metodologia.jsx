// src/components/pdf/Metodologia.jsx

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
    backgroundColor: "#164e63", // Cor ciano escuro
    textAlign: "center",
    padding: "12px 0",
    borderRadius: 4,
    marginBottom: 25,
  },
  // Card para cada seção de metodologia
  sectionCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "15px 20px",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0e7490",
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.6,
    color: "#334155",
    marginBottom: 8,
  },
  // Estilo para o texto de destaque (critério de conformidade)
  highlightText: {
    fontSize: 9.5,
    fontStyle: "italic",
    color: "#164e63",
    backgroundColor: "#f0f9ff",
    padding: "8px 12px",
    borderRadius: 3,
    marginTop: 5,
  },
});

const Metodologia = () => (
  // BOOKMARK ADICIONADO AQUI
  <Page
    size="A4"
    style={styles.page}
    bookmark={{ title: "3. METODOLOGIA APLICADA", id: "metodologia" }}
  >
    <Text style={styles.mainTitle}>3. Metodologia e Critérios</Text>

    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Resistência de Isolamento</Text>
      <Text style={styles.text}>
        A resistência de isolamento é a resistência oferecida pelo conjunto de
        materiais isolantes de um equipamento. O Megômetro aplica uma tensão de
        corrente contínua e realiza a leitura da corrente de fuga, calculando a
        resistência. Valores baixos indicam isolação deteriorada por umidade,
        sujeira ou carbonização.
      </Text>
      <Text style={styles.highlightText}>
        O índice de absorção (relação R10'/R1') deve ser no mínimo 1,3. O índice
        de polarização (relação R10'/R1') deve estar acima de 2. A resistência
        ôhmica corrigida para 20°C deve ser superior a 150 MΩ.
      </Text>
    </View>

    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>
        Resistência Ôhmica dos Enrolamentos
      </Text>
      <Text style={styles.text}>
        Mede a resistência do condutor de cada enrolamento, permitindo avaliar a
        integridade das conexões e do próprio condutor. Podem dar indicações
        sobre a existência de espiras em curto-circuito e conexões ou contatos
        em más condições.
      </Text>
      <Text style={styles.highlightText}>
        A determinação de não conformidade é uma diferença superior a 10% entre
        os valores medidos nas fases.
      </Text>
    </View>

    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Relação de Transformação (T.T.R)</Text>
      <Text style={styles.text}>
        Quando realizado a vazio, determina a proporção que existe entre a
        tensão do primário e a do secundário. A verificação do número de espiras
        é um recurso valioso para identificar espiras em curto-circuito, falhas
        em comutadores e ligações erradas.
      </Text>
      <Text style={styles.highlightText}>
        A variação dos valores medidos em relação aos da placa de identificação
        não deve ser maior que ± 0,5%.
      </Text>
    </View>

    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Testes de Aterramento</Text>
      <Text style={styles.text}>
        O terrômetro injeta no terreno uma corrente estabilizada e mede com alta
        precisão a tensão que aparece no terreno pela circulação dessa corrente
        através da difusão do aterramento, determinando a resistência da malha.
      </Text>
    </View>

    <Footer />
  </Page>
);

export default Metodologia;
