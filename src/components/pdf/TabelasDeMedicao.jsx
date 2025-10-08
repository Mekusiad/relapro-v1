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

// =============================================================================
// CORREÇÃO FINAL DO MAPEAMENTO APLICADA AQUI
// =============================================================================
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
  BATERIA: TabelaBancoDeBaterias, // Chave corrigida de 'BANCO_BATERIAS' para 'BATERIA'
  BANCO_BATERIAS: TabelaBancoDeBaterias, // Mantido por segurança
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

  // LOG: Verifica quantos componentes serão renderizados
  console.log(
    `[TabelasDeMedicao] Total de componentes com ensaios para renderizar: ${componentsToRender.length}`
  );

  if (componentsToRender.length === 0) {
    return null;
  }

  return (
    <>
      {componentsToRender.map((component, index) => {
        const ComponentTable = componentTableMap[component.tipo];

        // LOG: Mostra qual componente está sendo processado no loop
        console.log(
          `[TabelasDeMedicao] Processando componente [${index}]: ID=${component.id}, Tipo=${component.tipo}`
        );

        if (!ComponentTable) {
          // LOG: Alerta se um tipo de componente não tem uma tabela mapeada
          console.warn(
            `[TabelasDeMedicao] AVISO: Nenhum componente de tabela encontrado para o tipo '${component.tipo}'.`
          );
        }

        // Lógica de bookmark corrigida
        let pageBookmark = {
          title: component.nomeEquipamento,
          id: `comp_${component.id}`,
        };
        if (index === 0) {
          pageBookmark = {
            title: "4. MEDIÇÕES DOS EQUIPAMENTOS",
            id: "medicoes",
            children: [pageBookmark],
          };
        }

        // LOG: Mostra qual objeto de bookmark está sendo criado para esta página
        console.log(
          `[TabelasDeMedicao] Bookmark criado para a página [${index}]:`,
          pageBookmark
        );

        return (
          <Page
            key={component.id}
            size="A4"
            style={styles.page}
            break={index > 0}
          >
            <View id={`ancora_comp_${component.id}`} />

            {index === 0 && (
              <Text style={styles.mainTitle}>Medições dos Equipamentos</Text>
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
