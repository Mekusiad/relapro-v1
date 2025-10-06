// src/components/pdf/TabelasDeMedicao.jsx

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import Footer from "./Footer.jsx";

// Importações de todas as tabelas
import TabelaResistor from "./tabelas/TabelaResistor.jsx";
import TabelaCabosEMuflas from "./tabelas/TabelaCabosEMuflas.jsx";
import TabelaPararaios from "./tabelas/TabelaPararaios.jsx";
import TabelaBancoDeBaterias from "./tabelas/TabelaBancoDeBaterias.jsx";
import TabelaDisjuntorMedia from "./tabelas/TabelaDisjuntorMedia.jsx";
import TabelaChaveSeccionadora from "./tabelas/TabelaChaveSeccionadora.jsx";
import TabelaTransformadorMedia from "./tabelas/TabelaTransformadorMedia.jsx";
import TabelaDisjuntorAlta from "./tabelas/TabelaDisjuntorAlta.jsx";
import TabelaTransformadorCorrente from "./tabelas/TabelaTransformadorCorrente.jsx";
import TabelaTransformadorPotencial from "./tabelas/TabelaTransformadorPotencial.jsx";
import TabelaTransformadorAlta from "./tabelas/TabelaTransformadorAlta.jsx";
import TabelaMalhaAterramento from "./tabelas/TabelaMalhaAterramento.jsx";

const componentTableMap = {
  MALHA: TabelaMalhaAterramento,
  RESISTOR: TabelaResistor,
  PARARAIO: TabelaPararaios,
  CABOMUFLA: TabelaCabosEMuflas,
  CHAVE_SECCIONADORA_ALTA: TabelaChaveSeccionadora,
  CHAVE_SECCIONADORA_MEDIA: TabelaChaveSeccionadora,
  DISJUNTOR_ALTA: TabelaDisjuntorAlta,
  DISJUNTOR_MEDIA: TabelaDisjuntorMedia,
  TRAFO_ALTA: TabelaTransformadorAlta,
  TRAFO_MEDIA: TabelaTransformadorMedia,
  TRAFO_CORRENTE: TabelaTransformadorCorrente,
  TRAFO_POTENCIAL: TabelaTransformadorPotencial,
  BATERIA: TabelaBancoDeBaterias,
  BANCO_BATERIAS: TabelaBancoDeBaterias,
};

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
  substationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0e7490",
    paddingBottom: 5,
    borderBottom: "2px solid #0e7490",
    marginBottom: 20,
  },
  notImplemented: {
    fontSize: 10,
    color: "#ef4444",
    padding: 10,
    border: "1px solid #fecaca",
    backgroundColor: "#fff1f2",
    borderRadius: 4,
  },
});

function TabelasDeMedicao({ subestacoes, Html, stylesheet }) {
  const componentsToRender = subestacoes
    ? subestacoes.flatMap((sub) =>
        (sub.componentes || [])
          .filter((comp) => comp.ensaios && comp.ensaios.length > 0)
          .map((comp) => ({ ...comp, nomeSubestacao: sub.nome }))
      )
    : [];

  if (componentsToRender.length === 0) {
    return null;
  }

  return (
    <>
      {componentsToRender.map((component, index) => {
        const ComponentTable = componentTableMap[component.tipo];

        // Lógica para definir os bookmarks corretamente na página
        let pageBookmark = {
          title: `${component.nomeEquipamento} (${component.tag})`,
          id: `comp_${component.id}`,
        };

        // Se for a PRIMEIRA página de medição, adiciona o bookmark principal da seção
        if (index === 0) {
          pageBookmark = {
            title: "4. MEDIÇÕES DOS EQUIPAMENTOS",
            id: "medicoes",
            // Adiciona o bookmark do componente específico como um filho (sub-item)
            children: [pageBookmark],
          };
        }

        return (
          <Page
            key={component.id}
            size="A4"
            style={styles.page}
            break={index > 0}
            // O bookmark corrigido é aplicado diretamente aqui
            bookmark={pageBookmark}
          >
            {/* O título da seção só aparece visualmente na primeira página */}
            {index === 0 && (
              <Text style={styles.mainTitle}>4. Medições dos Equipamentos</Text>
            )}

            <Text style={styles.substationTitle}>
              Subestação: {component.nomeSubestacao}
            </Text>

            <View>
              {ComponentTable ? (
                <ComponentTable
                  componente={component}
                  Html={Html}
                  stylesheet={stylesheet}
                />
              ) : (
                <Text style={styles.notImplemented}>
                  Tabela de medição para o tipo '{component.tipo}' ainda não foi
                  implementada.
                </Text>
              )}
            </View>

            <Footer />
          </Page>
        );
      })}
    </>
  );
}

export default TabelasDeMedicao;
