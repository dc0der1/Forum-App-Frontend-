import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Input({ label, placeholder, onChangeText, value, ...rest }) {

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput 
                style={styles.input} 
                placeholderTextColor="#9ca3af"
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText} 
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    }, 
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: "#111827",
    },
});