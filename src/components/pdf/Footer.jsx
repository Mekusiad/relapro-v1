// src/components/pdf/Footer.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#475569", // Cor mais suave (slate-600)
    borderTop: "1px solid #e2e8f0", // Borda mais sutil (slate-200)
    paddingTop: 8,
    fontFamily: "Roboto",
  },
});

const Footer = () => (
  <View style={styles.footer} fixed>
    {/* CORREÇÃO: Nome da empresa atualizado e data removida */}
    <Text>Nexus Control</Text>

    {/* A numeração de página já funciona corretamente */}
    <Text
      render={({ pageNumber, totalPages }) =>
        `Página ${pageNumber} de ${totalPages}`
      }
    />
  </View>
);

export default Footer;
