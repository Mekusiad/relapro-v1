// src/services/pdfService.jsx

import React from "react";
import { pdf } from "@react-pdf/renderer";
import RelatorioPDF from "../components/pdf/RelatorioPDF.jsx";
import Html from "react-pdf-html";

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

/**
 * Gera o PDF a partir do componente React e o abre em uma nova aba.
 * Implementa a renderização em duas passagens para corrigir a paginação do sumário.
 */
export async function gerarRelatorioPDF(osData, allTechnicians) {
  // Envolvemos a lógica assíncrona numa nova Promise para gerir o resolve/reject
  return new Promise((resolve, reject) => {
    // Usamos uma função auto-executável para poder usar async/await dentro da Promise
    (async () => {
      try {
        console.log("Iniciando geração de PDF para a OS:", osData.numeroOs);

        const stylesheet = {
          p: { fontSize: 9, lineHeight: 1.4 },
          strong: { fontWeight: "bold" },
        };

        let pageNumbers = null;

        // LÓGICA DE CAPTURA ROBUSTA COM PROMISE
        // 1. Criamos uma Promise que será resolvida pela callback 'onRender'
        let onRenderResolve;
        const pageNumbersPromise = new Promise((resolve) => {
          onRenderResolve = resolve;
        });

        // 2. A callback agora simplesmente resolve a Promise com os dados recebidos
        const capturePageNumbers = ({ pageNumberByBookmark }) => {
          console.log("Callback 'onRender' executada.");
          onRenderResolve(pageNumberByBookmark || null);
        }; // --- 1. Primeira Passagem (para obter os números de página) ---

        const Passagem1 = (
          <RelatorioPDF
            osData={osData}
            allTechnicians={allTechnicians}
            Html={Html}
            stylesheet={stylesheet}
            onRenderCallback={capturePageNumbers}
            pageNumbers={null}
          />
        );
        console.log("Iniciando a primeira passagem da renderização..."); // 3. Iniciamos a renderização, mas não esperamos por ela aqui.
        // O resultado não nos interessa, apenas a execução da callback.
        pdf(Passagem1).toBlob();

        // 4. Adicionamos um timeout para evitar que o processo fique preso
        const timeout = setTimeout(() => {
          reject(
            new Error("Falha ao calcular a paginação do sumário (timeout).")
          );
        }, 15000); // 15 segundos

        // 5. Aguardamos a callback 'onRender' resolver a nossa Promise
        pageNumbers = await pageNumbersPromise;
        clearTimeout(timeout); // Limpamos o timeout pois a promise resolveu a tempo

        if (!pageNumbers || Object.keys(pageNumbers).length === 0) {
          return reject(
            new Error(
              "Falha ao calcular a paginação do sumário. Verifique se os bookmarks estão definidos corretamente."
            )
          );
        }
        console.log("Números de página extraídos com sucesso:", pageNumbers); // --- 2. Segunda Passagem (para gerar o PDF final) ---

        const Passagem2 = (
          <RelatorioPDF
            osData={osData}
            allTechnicians={allTechnicians}
            Html={Html}
            stylesheet={stylesheet}
            pageNumbers={pageNumbers}
          />
        );

        const blobFinal = await pdf(Passagem2).toBlob();
        const url = URL.createObjectURL(blobFinal);
        window.open(url, "_blank");
        console.log("PDF gerado e aberto com sucesso.");
        resolve();
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        reject(error);
      }
    })();
  });
}

// // src/services/pdfService.jsx

// import React from "react";
// import { pdf } from "@react-pdf/renderer";
// import RelatorioPDF from "../components/pdf/RelatorioPDF.jsx";
// import Html from "react-pdf-html";

// export const SERVICE_TYPE_NAMES = {
//   MANUTENCAO_PREVENTIVA: "Manutenção Preventiva",
//   MANUTENCAO_CORRETIVA: "Manutenção Corretiva",
//   MANUTENCAO_PREDITIVA: "Manutenção Preditiva",
//   FOTOGRAFICO: "Relatório Fotográfico",
//   TERMOGRAFIA: "Termografia",
//   ENSAIO_EPI: "Ensaio de EPI",
//   INSTALACAO: "Instalação",
//   INSPECAO: "Inspeção",
//   REFORMA: "Reforma",
//   OUTRO: "Serviços Diversos",
// };

// /**
//  * Gera o PDF a partir do componente React e o abre em uma nova aba.
//  * Implementa a renderização em duas passagens para corrigir a paginação do sumário.
//  */
// export async function gerarRelatorioPDF(osData, allTechnicians) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       console.log("Iniciando geração de PDF para a OS:", osData);

//       const stylesheet = {
//         p: { fontSize: 9, lineHeight: 1.4 },
//         strong: { fontWeight: "bold" },
//       };

//       let pageNumbers = null;

//       // Callback para capturar os números de página da primeira renderização
//       const capturePageNumbers = ({ outline }) => {
//         console.log("Primeira passagem concluída. Extraindo bookmarks...");
//         const bookmarks = outline?.children || [];
//         const numbers = {};

//         const mapBookmarks = (items) => {
//           items.forEach((item) => {
//             if (item.props.id) {
//               numbers[item.props.id] = item.props.pageNumber;
//             }
//             if (item.children) mapBookmarks(item.children);
//           });
//         };

//         mapBookmarks(bookmarks);
//         pageNumbers = numbers;
//         console.log("Números de página extraídos:", pageNumbers);
//       };

//       // --- 1. Primeira Passagem (para obter os números de página) ---
//       const Passagem1 = (
//         <RelatorioPDF
//           osData={osData}
//           allTechnicians={allTechnicians}
//           Html={Html}
//           stylesheet={stylesheet}
//           onRenderCallback={capturePageNumbers} // Passa o callback para o componente
//         />
//       );

//       // Renderiza em memória para executar o callback 'capturePageNumbers'
//       await pdf(Passagem1).toBlob();

//       if (!pageNumbers) {
//         return reject(new Error("Falha ao calcular a paginação do sumário."));
//       }

//       // --- 2. Segunda Passagem (para gerar o PDF final) ---
//       const Passagem2 = (
//         <RelatorioPDF
//           osData={osData}
//           allTechnicians={allTechnicians}
//           Html={Html}
//           stylesheet={stylesheet}
//           pageNumbers={pageNumbers} // Agora passa os números corretos para o sumário
//         />
//       );

//       const blobFinal = await pdf(Passagem2).toBlob();

//       // Abre o PDF em uma nova aba
//       const url = URL.createObjectURL(blobFinal);
//       window.open(url, "_blank");
//       URL.revokeObjectURL(url);

//       console.log("PDF gerado e aberto com sucesso.");
//       resolve();
//     } catch (error) {
//       console.error("Erro ao gerar PDF:", error);
//       reject(error);
//     }
//   });
// }
