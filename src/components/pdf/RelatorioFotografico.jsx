// src/components/pdf/RelatorioFotografico.jsx

import React from "react";
import { Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import Footer from "./Footer.jsx";

const styles = StyleSheet.create({
  page: {
    padding: "40px 40px 60px 40px",
    fontFamily: "Roboto",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 25,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoWrapper: {
    width: "48%",
    marginBottom: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    border: "1px solid #e2e8f0",
    borderRadius: 3,
    marginBottom: 5,
  },
  caption: {
    fontSize: 8,
    color: "#475569",
    textAlign: "center",
    paddingHorizontal: 5,
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

  const photoChunks = chunkPhotos(photos, 4);

  return (
    <>
      {photoChunks.map((chunk, pageIndex) => (
        // --- CORREÇÃO APLICADA AQUI ---
        // A propriedade bookmark é adicionada condicionalmente à Page.
        // Se for a primeira página (index 0), o objeto bookmark é criado.
        // Se não, nenhuma propriedade bookmark é adicionada.
        <Page
          key={pageIndex}
          size="A4"
          style={styles.page}
          {...(pageIndex === 0 && { bookmark: { title, id: bookmarkId } })}
        >
          {/* O título visual continua aparecendo apenas na primeira página */}
          {pageIndex === 0 && <Text style={styles.mainTitle}>{title}</Text>}

          <View style={styles.gridContainer}>
            {chunk.map((photo, photoIndex) => (
              <View key={photo.id || photoIndex} style={styles.photoWrapper}>
                <Image
                  src={photo.fotoUrl || photo.preview}
                  style={styles.image}
                />
                <Text style={styles.caption}>
                  {photo.descricao ||
                    `Imagem ${pageIndex * 4 + photoIndex + 1}`}
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
