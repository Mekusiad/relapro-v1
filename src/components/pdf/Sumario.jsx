// src/components/pdf/Sumario.jsx

import React from "react";
import { Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import Footer from "./Footer.jsx";

const styles = StyleSheet.create({
  page: { padding: "40px 40px 60px 40px", fontFamily: "Roboto" },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#164e63",
    textAlign: "center",
    padding: "12px 0",
    borderRadius: 4,
    marginBottom: 30,
  },
  tocContainer: { display: "flex", flexDirection: "column", gap: 12 },
  tocItem: { flexDirection: "row", alignItems: "flex-end" },
  tocLink: { textDecoration: "none", color: "#334155" },
  tocText: { fontSize: 11 },
  mainItemText: { fontWeight: "bold" },
  equipmentTypeText: { paddingLeft: 15, fontStyle: "italic", color: "#475569" },
  // Estilo ajustado para os sub-itens
  componentItemContainer: {
    flexDirection: "row",
    paddingLeft: 30,
    marginTop: 4,
  },
  componentItemText: { fontSize: 10, color: "#52525b" },
  dots: {
    flex: 1,
    borderBottom: "1.5px dotted #cbd5e1",
    margin: "0 5px",
    height: "6px",
  },
  pageNumber: { fontSize: 11, fontWeight: "bold", color: "#334155" },
});

// Componente TocItem permanece o mesmo
const TocItem = ({ text, page, link, style }) => (
  <View style={styles.tocItem}>
    <Link src={link} style={styles.tocLink}>
      <Text style={[styles.tocText, style]}>{text}</Text>
    </Link>
    <Text style={styles.dots} />
    <Text style={styles.pageNumber}>{page ?? "??"}</Text>
  </View>
);

function Sumario({ osData, sections, pageNumbers }) {
  const getPage = (id) => pageNumbers?.[id];

  const groupedComponents = (osData.subestacoes || [])
    .flatMap(
      (sub) =>
        sub.componentes?.filter(
          (comp) => comp.ensaios && comp.ensaios.length > 0
        ) || []
    )
    .reduce((acc, comp) => {
      const key = comp.nomeEquipamento;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(comp);
      return acc;
    }, {});

  if (!osData) return null;

  return (
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "Sumário", id: "sumario" }}
    >
      <Text style={styles.mainTitle}>Sumário</Text>

      <View style={styles.tocContainer}>
        <TocItem
          text="1. DADOS DA ORDEM DE SERVIÇO"
          page={getPage("dados_os")}
          link="#dados_os"
          style={styles.mainItemText}
        />
        {sections.hasRecommendations && (
          <TocItem
            text="2. RECOMENDAÇÕES TÉCNICAS"
            page={getPage("recomendacoes")}
            link="#recomendacoes"
            style={styles.mainItemText}
          />
        )}
        <TocItem
          text="3. METODOLOGIA APLICADA"
          page={getPage("metodologia")}
          link="#metodologia"
          style={styles.mainItemText}
        />

        {sections.hasMeasurements && (
          <>
            <TocItem
              text="4. MEDIÇÕES DOS EQUIPAMENTOS"
              page={getPage("medicoes")}
              link="#medicoes"
              style={styles.mainItemText}
            />

            {Object.entries(groupedComponents).map(
              ([equipmentName, components]) => (
                <View key={equipmentName}>
                  {/* 1. O TIPO de equipamento continua a ser um TocItem completo */}
                  <TocItem
                    text={equipmentName}
                    page={getPage(`comp_${components[0].id}`)}
                    link={`#comp_${components[0].id}`}
                    style={styles.equipmentTypeText}
                  />
                  {/* 2. Os componentes individuais agora são renderizados como texto simples dentro de uma View */}
                  {components.map((comp) => (
                    <View key={comp.id} style={styles.componentItemContainer}>
                      <Link src={`#comp_${comp.id}`} style={styles.tocLink}>
                        {/* O traço "-" foi removido daqui */}
                        <Text style={styles.componentItemText}>{comp.tag}</Text>
                      </Link>
                    </View>
                  ))}
                </View>
              )
            )}
          </>
        )}

        <TocItem
          text="5. CONCLUSÃO"
          page={getPage("conclusao")}
          link="#conclusao"
          style={styles.mainItemText}
        />
        {pageNumbers?.fotos_antes && (
          <TocItem
            text="6. RELATÓRIO FOTOGRÁFICO - ANTES"
            page={getPage("fotos_antes")}
            link="#fotos_antes"
            style={styles.mainItemText}
          />
        )}
        {pageNumbers?.fotos_durante && (
          <TocItem
            text="7. RELATÓRIO FOTOGRÁFICO - DURANTE"
            page={getPage("fotos_durante")}
            link="#fotos_durante"
            style={styles.mainItemText}
          />
        )}
        {pageNumbers?.fotos_depois && (
          <TocItem
            text="8. RELATÓRIO FOTOGRÁFICO - DEPOIS"
            page={getPage("fotos_depois")}
            link="#fotos_depois"
            style={styles.mainItemText}
          />
        )}
      </View>

      <Footer />
    </Page>
  );
}

export default Sumario;
