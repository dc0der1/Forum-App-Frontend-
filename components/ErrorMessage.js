import { Text, StyleSheet } from "react-native";

export default function ErrorMessage({ errorMessage, color }) {
    return (
        <Text style={[styles.text, { color }]}>{errorMessage}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontWeight: "bold", 
        textAlign: "center"
    },
});