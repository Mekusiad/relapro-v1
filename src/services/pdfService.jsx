// src/services/pdfService.jsx

import React from "react";
import { pdf } from "@react-pdf/renderer";
import RelatorioPDF from "../components/pdf/RelatorioPDF.jsx";
import { Buffer } from "buffer";

// Adiciona um "polyfill" para a função 'Buffer' que é necessária para
// o processamento de imagens no navegador.
window.Buffer = Buffer;

export const SERVICE_TYPE_NAMES = {
  MANUTENCAO_PREVENTIVA: "Manutenção Preventiva",
  MANUTENCAO_CORRETIVA: "Manutenção Corretiva",
  MANUTENCAO_PREDITIVA: "Manutenção Preditiva",
  FOTOGRAFICO: "Relatório Fotográfico",
  TERMOGRAFIA: "Termografia",
  ENSAIO_EPI: "Ensaio de EPI",
  INSTALACAO: "Instalação",
  INSPECAO: "Inspeção",
  REFORMA: "Reforma",
  OUTRO: "Serviços Diversos",
};

export async function gerarRelatorioPDF(osData, allTechnicians) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // console.log(`[pdfService] Iniciando geração de PDF para a OS: ${osData.numeroOs}`);

        let pageNumbers = null;
        let onRenderResolve;
        const pageNumbersPromise = new Promise((resolveCallback) => {
          onRenderResolve = resolveCallback;
        });

        // --- CORREÇÃO APLICADA AQUI ---
        // Agora, construímos manualmente o objeto de bookmarks a partir da árvore de layout.
        const capturePageNumbers = (renderResult) => {
          // console.log("[pdfService] Callback 'onRender' EXECUTADA. Argumento recebido:", renderResult);
          const layoutData = renderResult?._INTERNAL__LAYOUT__DATA_;

          if (!layoutData || !layoutData.children) {
            console.error(
              "[pdfService] _INTERNAL__LAYOUT__DATA_ ou seus filhos não encontrados."
            );
            onRenderResolve({});
            return;
          }

          const bookmarks = {};
          // Percorremos cada página renderizada no documento
          layoutData.children.forEach((pageNode, pageIndex) => {
            const currentPageNumber = pageIndex + 1; // Números de página começam em 1
            const bookmark = pageNode.props?.bookmark;

            if (bookmark && bookmark.id) {
              // Adicionamos o bookmark principal da página
              bookmarks[bookmark.id] = currentPageNumber;

              // Verificamos se há bookmarks aninhados (como na Tabela de Medições)
              if (bookmark.children && Array.isArray(bookmark.children)) {
                bookmark.children.forEach((childBookmark) => {
                  if (childBookmark.id) {
                    bookmarks[childBookmark.id] = currentPageNumber;
                  }
                });
              }
            }
          });

          // console.log("[pdfService] Bookmarks extraídos manualmente:", bookmarks);
          onRenderResolve(bookmarks || {});
        };
        // ------------------------------------

        const Passagem1 = (
          <RelatorioPDF
            osData={osData}
            allTechnicians={allTechnicians}
            onRenderCallback={capturePageNumbers}
            pageNumbers={null}
          />
        );

        console.log(
          "[pdfService] Iniciando a PRIMEIRA passagem da renderização..."
        );
        pdf(Passagem1).toBlob();

        const timeoutPromise = new Promise((_, rejectTimeout) =>
          setTimeout(() => {
            rejectTimeout(
              new Error(
                "Timeout! A primeira passagem demorou mais de 15 segundos."
              )
            );
          }, 15000)
        );

        pageNumbers = await Promise.race([pageNumbersPromise, timeoutPromise]);

        // console.log("[pdfService] Números de página extraídos com sucesso:", pageNumbers);

        if (!pageNumbers || Object.keys(pageNumbers).length === 0) {
          const errorMsg =
            "Falha ao calcular a paginação do sumário. A renderização inicial não encontrou nenhum bookmark.";
          console.error(`[pdfService] ERRO: ${errorMsg}`);
          return reject(new Error(errorMsg));
        }

        console.log(
          "[pdfService] Iniciando a SEGUNDA passagem com o sumário paginado..."
        );
        const Passagem2 = (
          <RelatorioPDF
            osData={osData}
            allTechnicians={allTechnicians}
            pageNumbers={pageNumbers}
          />
        );

        const blobFinal = await pdf(Passagem2).toBlob();
        const url = URL.createObjectURL(blobFinal);
        window.open(url, "_blank");

        console.log("[pdfService] ✅ PDF gerado e aberto com sucesso.");
        resolve();
      } catch (error) {
        console.error(
          "[pdfService] ❌ CRASH! Ocorreu um erro geral na geração do PDF:",
          error
        );
        reject(error);
      }
    })();
  });
}
