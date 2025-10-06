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

// Registra as fontes para garantir que o PDF seja renderizado corretamente
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

function RelatorioPDF({
  osData,
  allTechnicians,
  Html,
  stylesheet,
  onRenderCallback,
  pageNumbers,
}) {
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
    <Document onRender={onRenderCallback}>
      {/* 1. Capa */}
      <Capa osData={osData} />

      {/* 2. Sumário (passa os números das páginas, se disponíveis) */}
      <Sumario osData={osData} sections={sections} pageNumbers={pageNumbers} />

      {/* 3. Dados da OS */}
      <DadosDaOS osData={osData} allTechnicians={allTechnicians} />

      {/* 4. Recomendações (renderizado condicionalmente) */}
      {sections.hasRecommendations && <Recomendacoes osData={osData} />}

      {/* 5. Metodologia */}
      <Metodologia />

      {/* 6. Tabelas de Medição (renderizado condicionalmente) */}
      {sections.hasMeasurements && (
        <TabelasDeMedicao
          subestacoes={osData.subestacoes}
          Html={Html}
          stylesheet={stylesheet}
        />
      )}

      {/* 7. Conclusão */}
      <Conclusao osData={osData} />

      {/* 8. Relatórios Fotográficos (renderizados condicionalmente) */}
      <RelatorioFotografico
        title="6. RELATÓRIO FOTOGRÁFICO - ANTES"
        photos={sections.fotosAntes}
        bookmarkId="fotos_antes"
      />
      <RelatorioFotografico
        title="7. RELATÓRIO FOTOGRÁFICO - DURANTE"
        photos={sections.fotosDurante}
        bookmarkId="fotos_durante"
      />
      <RelatorioFotografico
        title="8. RELATÓRIO FOTOGRÁFICO - DEPOIS"
        photos={sections.fotosDepois}
        bookmarkId="fotos_depois"
      />
    </Document>
  );
}

export default RelatorioPDF;
