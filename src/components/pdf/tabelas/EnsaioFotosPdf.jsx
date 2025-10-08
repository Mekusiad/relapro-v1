import React from "react";
import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    paddingTop: 8,
    borderTop: "1px solid #e2e8f0",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 8,
  },
  gridContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 10,
  },
  photoWrapper: {
    width: "32%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  image: {
    width: "100%",

    objectFit: "contain",

    border: "1px solid #e2e8f0",
    borderRadius: 3,
  },
  caption: {
    fontSize: 8,
    color: "#475569",
    textAlign: "center",
  },
});

const EnsaioFotosPdf = ({ fotos }) => {
  if (!fotos || fotos.length === 0) {
    return null;
  }

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>Registros Fotográficos do Ensaio:</Text>
      <View style={styles.gridContainer}>
        {fotos.map((foto) => (
          <View key={foto.id} style={styles.photoWrapper}>
            <Image src={foto.fotoUrl} style={styles.image} />
            <Text style={styles.caption}>
              {foto.descricao || "Sem descrição"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default EnsaioFotosPdf;
