import React from "react";
import { Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
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
    backgroundColor: "#164e63",
    textAlign: "center",
    padding: "12px 0",
    borderRadius: 4,
    marginBottom: 25,
  },
  gridContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // ==================================================
    // INÍCIO DA CORREÇÃO
    // Espaçamento ajustado para 3 colunas
    // ==================================================
    gap: 15,
    // ==================================================
    // FIM DA CORREÇÃO
    // ==================================================
  },
  photoWrapper: {
    // ==================================================
    // INÍCIO DA CORREÇÃO
    // Largura ajustada para 3 fotos por linha
    // ==================================================
    width: "31%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    // ==================================================
    // FIM DA CORREÇÃO
    // ==================================================
  },
  image: {
    width: "100%",
    // ==================================================
    // INÍCIO DA CORREÇÃO
    // 'height' removida e 'objectFit' alterado para 'contain'
    // ==================================================
    objectFit: "contain",
    // ==================================================
    // FIM DA CORREÇÃO
    // ==================================================
    border: "1px solid #e2e8f0",
    borderRadius: 3,
  },
  caption: {
    fontSize: 8,
    color: "#475569",
    textAlign: "center",
  },
});

const chunkPhotos = (photos, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < photos.length; i += chunkSize) {
    chunks.push(photos.slice(i, i + chunkSize));
  }
  return chunks;
};

const RelatorioFotografico = ({ title, photos, bookmarkId }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  // Ajusta a quantidade de fotos por página para 6 (2 linhas de 3)
  const photoChunks = chunkPhotos(photos, 6);

  return (
    <>
      {photoChunks.map((chunk, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          id={bookmarkId}
          style={styles.page}
          {...(pageIndex === 0 && { bookmark: { title, id: bookmarkId } })}
        >
          {pageIndex === 0 && <Text style={styles.mainTitle}>{title}</Text>}

          <View style={styles.gridContainer}>
            {chunk.map((photo) => (
              <View
                key={photo.id || photo.cloudinaryId}
                style={styles.photoWrapper}
              >
                <Image src={photo.fotoUrl} style={styles.image} />
                <Text style={styles.caption}>
                  {photo.descricao || "Sem descrição"}
                </Text>
              </View>
            ))}
          </View>
          <Footer />
        </Page>
      ))}
    </>
  );
};

export default RelatorioFotografico;
