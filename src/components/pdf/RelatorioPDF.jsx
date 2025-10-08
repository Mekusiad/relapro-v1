// src/components/pdf/RelatorioPDF.jsx

import React, { useMemo } from "react";
import { Document, Font } from "@react-pdf/renderer";

import Capa from "./Capa.jsx";
import Sumario from "./Sumario.jsx";
import DadosDaOS from "./DadosDaOS.jsx";
import Recomendacoes from "./Recomendacoes.jsx";
import Metodologia from "./Metodologia.jsx";
import TabelasDeMedicao from "./TabelasDeMedicao.jsx";
import Conclusao from "./Conclusao.jsx";
import RelatorioFotografico from "./RelatorioFotografico.jsx";

// --- CORREÇÃO APLICADA AQUI ---
// Registramos as fontes novamente, mas agora usando caminhos locais.
// IMPORTANTE: Você DEVE criar uma pasta 'public/fonts' no seu projeto
// e colocar os arquivos da fonte Roboto (ttf) dentro dela.
try {
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
        fontWeight: "normal",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
        fontWeight: "bold",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
        fontWeight: "normal",
        fontStyle: "italic",
      },
    ],
  });
} catch (e) {
  console.error("Erro ao registrar fontes:", e);
}
// -----------------------------

function RelatorioPDF({
  osData,
  allTechnicians,
  onRenderCallback,
  pageNumbers,
}) {
  console.log(osData);
  const sections = useMemo(() => {
    const hasMeasurements = osData.subestacoes?.some((sub) =>
      sub.componentes?.some((comp) => comp.ensaios && comp.ensaios.length > 0)
    );
    const hasRecommendations =
      osData.recomendacoes ||
      osData.subestacoes?.some((sub) =>
        sub.componentes?.some((comp) =>
          comp.ensaios?.some((e) => e.dados?.naoConforme)
        )
      );

    const fotosAntes =
      osData.fotos?.filter((foto) => foto.tipoFoto === "ANTES") || [];
    const fotosDurante =
      osData.fotos?.filter((foto) => foto.tipoFoto === "DURANTE") || [];
    const fotosDepois =
      osData.fotos?.filter((foto) => foto.tipoFoto === "DEPOIS") || [];

    return {
      hasMeasurements,
      hasRecommendations,
      fotosAntes,
      fotosDurante,
      fotosDepois,
    };
  }, [osData]);

  return (
    <Document
      onRender={onRenderCallback}
      title={`Relatório OS ${osData.numeroOs}`}
    >
      <Capa osData={osData} bookmarkId="capa" />
      <Sumario osData={osData} sections={sections} pageNumbers={pageNumbers} />
      <DadosDaOS
        osData={osData}
        allTechnicians={allTechnicians}
        bookmarkId="dados_os"
      />
      {sections.hasRecommendations && (
        <Recomendacoes osData={osData} bookmarkId="recomendacoes" />
      )}
      <Metodologia bookmarkId="metodologia" />
      {sections.hasMeasurements && (
        <TabelasDeMedicao subestacoes={osData.subestacoes} />
      )}
      <Conclusao osData={osData} bookmarkId="conclusao" />
      <RelatorioFotografico
        title="Relatório Fotográfico - ANTES"
        photos={sections.fotosAntes}
        bookmarkId="fotos_antes"
      />
      <RelatorioFotografico
        title="Relatório Fotográfico - DURANTE"
        photos={sections.fotosDurante}
        bookmarkId="fotos_durante"
      />
      <RelatorioFotografico
        title="Relatório Fotográfico - DEPOIS"
        photos={sections.fotosDepois}
        bookmarkId="fotos_depois"
      />
    </Document>
  );
}

export default RelatorioPDF;
