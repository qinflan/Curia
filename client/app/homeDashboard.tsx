import React from "react";
import { Text, View, StyleSheet } from "react-native";

const STEPS = [
  { label: "House",    side: "left",  bg: "#E6D9FF", fg: "#5B3FA3" },
  { label: "Proposed", side: "right", bg: "#D7F7EC", fg: "#108464" },
  { label: "Drafted",  side: "left",  bg: "#DCEEFF", fg: "#2A6FBB" },
];

export default function HomeDashboard() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Law Progression</Text>
        <Text style={styles.subtitle}>Last updated 4/21/2024</Text>

        {/* dashed vertical rail */}
        <View pointerEvents="none" style={styles.centerLine} />

        {/* timeline rows */}
        <View style={{ gap: 22 }}>
          {STEPS.map((s) => (
            <View key={s.label} style={styles.row}>
              {/* left side */}
              <View style={styles.sideCol}>
                {s.side === "left" ? (
                  <View style={[styles.pill, { backgroundColor: s.bg }]}>
                    <Text style={[styles.pillText, { color: s.fg }]}>{s.label}</Text>
                  </View>
                ) : (
                  <View style={{ height: 32 }} />
                )}
              </View>

              {/* center gutter around dashed line */}
              <View style={styles.lineCol} />

              {/* right side */}
              <View style={[styles.sideCol, { alignItems: "flex-start" }]}>
                {s.side === "right" ? (
                  <View style={[styles.pill, { backgroundColor: s.bg }]}>
                    <Text style={[styles.pillText, { color: s.fg }]}>{s.label}</Text>
                  </View>
                ) : (
                  <View style={{ height: 32 }} />
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    justifyContent: "center",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minHeight: 260,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 16,
    fontSize: 12,
    color: "#6B7280",
  },
  centerLine: {
    position: "absolute",
    top: 56,     // below the title/subtitle
    bottom: 16,
    left: "50%",
    width: 0,
    borderLeftWidth: 2,
    borderLeftColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
  },
  sideCol: {
    width: "45%",
    alignItems: "flex-end",
  },
  lineCol: {
    width: "10%",
  },
  pill: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
