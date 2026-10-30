import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

export default function LoginScreen({ navigation }) {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageColor, setErrorMessageColor] = useState("red");

    async function handleLogin() {
        try {
            const response = await fetch("http://10.0.2.2:8080/api/user/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({ email: email, password: password })
            });

            if (email.trim() === "") {
                setErrorMessage("Email input cannot be empty!");
                return;
            }

            if (password.trim() === "") {
                setErrorMessage("Password input cannot be empty!");
                return;
            }

            if (!response.ok) {
                setErrorMessage("Invalid email or password!");
                return;
            }

            const data = await response.json();

            await SecureStore.setItemAsync("userToken", data.token);
            await SecureStore.setItemAsync("userId", data.userId);

            navigation.navigate("Forums");

            console.log("Login successful, token saved!");
        } catch (error) {
            console.error("Login failed: ", error);
        }
        
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Brand Header */}
                    <View style={styles.brandHeader}>
                        <View style={styles.logoBadge}>
                            <Ionicons name="person" size={18} color="#fff" />
                        </View>
                        <Text style={styles.brandTitle}>Commonly</Text>
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                        {/* Icon Card */}
                        <View style={styles.iconBox}>
                            <MaterialCommunityIcons name="chat-processing-outline" size={28} color="#fff" />
                        </View>

                        <Text style={styles.welcomeSubtitle}>WELCOME BACK</Text>
                        <Text style={styles.title}>Good to see you.</Text>
                        <Text style={styles.description}>
                            Log in to catch up with your communities and keep the conversation going.
                        </Text>

                        <ErrorMessage errorMessage={errorMessage} color={errorMessageColor}/>

                        {/* Form Fields */}

                        {/* EMAIL FIELD */}
                        <Input 
                            label="Email" 
                            placeholder="you@example.com" 
                            onChangeText={setEmail} 
                            value={email}
                            autoCapitalize="none" 
                            keyboardType="email-address"
                        />

                        {/* PASSWORD FIELD */}
                        <Input 
                            label="Password" 
                            placeholder="At least 8 characters" 
                            value={password}
                            onChangeText={setPassword} 
                            secureTextEntry={true}
                        />

                        <Pressable style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </Pressable>

                        {/* Login Button */}
                        <Pressable style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Log in</Text>
                            <Feather name="chevron-right" size={20} color="#fff" style={styles.arrowIcon} />
                        </Pressable>
                    </View>

                    {/* Footer Registration Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>New around here? </Text>
                        <Pressable onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.createAccountText}>Create an account</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FAF8F5", // Warm cream background from Figma
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "space-between",
        paddingVertical: 20,
    }, 
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center", // Centers content vertically if screen has extra space
        padding: 24,
    }, 
    brandHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    logoBadge: {
        backgroundColor: "#1f2937",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    content: {
        marginTop: 20,
    },
    iconBox: {
        backgroundColor: "#f87171", // Coral-red color from Figma
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#f87171",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    welcomeSubtitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#f87171",
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: "#6b7280",
        lineHeight: 22,
        marginBottom: 30,
    },
    forgotContainer: {
        alignSelf: "flex-end",
        marginTop: 8,
    },
    forgotText: {
        color: "#f87171",
        fontSize: 14,
        fontWeight: "600",
    },
    loginButton: {
        backgroundColor: "#18181b", // Sleek dark/black button
        borderRadius: 14,
        height: 56,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    arrowIcon: {
        marginLeft: 4,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    footerText: {
        color: "#6b7280",
        fontSize: 14,
    },
    createAccountText: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});