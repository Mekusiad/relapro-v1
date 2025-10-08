// frontend/src/components/pdf/tabelas/EnsaioEquipamentosPdf.jsx

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

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
    marginBottom: 6,
  },
  equipmentList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  equipmentItem: {
    fontSize: 9,
    color: "#475569",
  },
  noItemsText: {
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
  },
});

const EnsaioEquipamentosPdf = ({ equipamentos }) => {
  if (!equipamentos || equipamentos.length === 0) {
    return null;
  }

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.subtitle}>Equipamentos Utilizados no Ensaio:</Text>
      <View style={styles.equipmentList}>
        {equipamentos.map((equip) => (
          <Text key={equip.id} style={styles.equipmentItem}>
            • {equip.nome} (Série: {equip.numeroSerie || "N/A"})
          </Text>
        ))}
      </View>
    </View>
  );
};

export default EnsaioEquipamentosPdf;
