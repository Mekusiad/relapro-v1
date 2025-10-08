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
  substationItemText: {
    paddingLeft: 15,
    fontStyle: "italic",
    color: "#475569",
    fontWeight: "bold",
  },
  componentItemContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
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

  // ==================================================================
  // INÍCIO DA CORREÇÃO: Lógica para listar TODOS os equipamentos, não apenas agrupar por tipo.
  // ==================================================================
  const substationsWithMeasurements = (osData.subestacoes || [])
    .map((substation) => {
      const componentsWithEssays = (substation.componentes || []).filter(
        (comp) => comp.ensaios && comp.ensaios.length > 0
      );

      if (componentsWithEssays.length > 0) {
        return {
          id: substation.id,
          nome: substation.nome,
          componentes: componentsWithEssays, // Usa a lista completa de componentes com ensaios
        };
      }
      return null;
    })
    .filter((sub) => sub !== null);
  // ==================================================================
  // FIM DA CORREÇÃO
  // ==================================================================

  // Identifica o ID do primeiro componente de todos para tratar a numeração de página corretamente
  const firstComponentId =
    substationsWithMeasurements?.[0]?.componentes?.[0]?.id;

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
              link="#ancora_medicoes" // Link aponta para a âncora
              style={styles.mainItemText}
            />

            {substationsWithMeasurements.map((substation) => (
              <View key={substation.id}>
                <TocItem
                  text={substation.nome}
                  // O número da página é o da página do primeiro componente
                  page={
                    substation.componentes[0].id === firstComponentId
                      ? getPage("medicoes")
                      : getPage(`comp_${substation.componentes[0].id}`)
                  }
                  // O link aponta para a âncora do primeiro componente
                  link={`#ancora_comp_${substation.componentes[0].id}`}
                  style={styles.substationItemText}
                />

                {substation.componentes.map((comp) => (
                  <View key={comp.id} style={styles.componentItemContainer}>
                    <Link
                      src={`#ancora_comp_${comp.id}`}
                      style={styles.tocLink}
                    >
                      <Text style={styles.componentItemText}>
                        {comp.nomeEquipamento}
                      </Text>
                    </Link>
                    <Text style={styles.dots} />
                    <Text style={styles.pageNumber}>
                      {/* Lógica para pegar o número de página correto */}
                      {comp.id === firstComponentId
                        ? getPage("medicoes")
                        : getPage(`comp_${comp.id}`)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        <TocItem
          text="5. CONCLUSÃO"
          page={getPage("conclusao")}
          link="#conclusao"
          style={styles.mainItemText}
        />
        {getPage("fotos_antes") && (
          <TocItem
            text="6. RELATÓRIO FOTOGRÁFICO - ANTES"
            page={getPage("fotos_antes")}
            link="#fotos_antes"
            style={styles.mainItemText}
          />
        )}
        {getPage("fotos_durante") && (
          <TocItem
            text="7. RELATÓRIO FOTOGRÁFICO - DURANTE"
            page={getPage("fotos_durante")}
            link="#fotos_durante"
            style={styles.mainItemText}
          />
        )}
        {getPage("fotos_depois") && (
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
