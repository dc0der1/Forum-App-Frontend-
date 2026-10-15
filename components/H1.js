import { Text, StyleSheet } from "react-native";

export default function H1({ text }) {
    return (
        <Text style={styles.text}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 28, 
        fontWeight: "bold"
    }
});