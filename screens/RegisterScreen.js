import { StyleSheet, Text, TextInput, View, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

export default function RegisterScreen({ navigation }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageColor, setErrorMessageColor] = useState("red");

    async function handleAccountCreation() {
        try {
            const response = await fetch("http://10.0.2.2:8080/api/user/register", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({
                    username: username, 
                    email: email, 
                    password: password
                })
            });

            if (!username || username.trim() === "" || 
                !email || email.trim() === "" || 
                !password || password.trim() === "") {
                setErrorMessage("Please make sure your input fields aren't empty!");
                return;
            }

            if (username.length < 4) {
                setErrorMessage("Your username has to be at least 4 letters.");
                return;
            }

            validateEmail(email);

            if (password.length < 8) {
                setErrorMessage("Password must be at least 8 characters");
                return;
            }

            validatePassword(password);

            if (!response.ok) {
                setErrorMessage("Something went wrong");
                return;
            }

            console.log("Account created successfully");
            setErrorMessage("Successfully created an account!");
            setErrorMessageColor("green");
        } catch (error) {
            console.error(error);
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address");
        }

        return "";
    }

    function validatePassword(password) {
        const hasNumber = /[0-9]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[@#$%^&+=!]/.test(password);

        if (!hasNumber) {
            setErrorMessage("Password must contain at least one number");
            return;
        }

        if (!hasUppercase) {
            setErrorMessage("Password must contain at least one uppercase letter");
            return;
        }

        if (!hasSpecialChar) {
            setErrorMessage("Password must contain at least one special character");
            return;
        }

        return "";
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
                        {/* Plus Icon Card */}
                        <View style={styles.iconBox}>
                            <Feather name="plus" size={28} color="#fff" />
                        </View>

                        <Text style={styles.welcomeSubtitle}>JOIN THE CONVERSATION</Text>
                        <Text style={styles.title}>Find your people.</Text>
                        <Text style={styles.description}>
                            Create an account and join thoughtful conversations about the things you care about.
                        </Text>

                        <ErrorMessage errorMessage={errorMessage} color={errorMessageColor}/>

                        {/* Form Fields */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Display name</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="How should we call you?"
                                placeholderTextColor="#9ca3af"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#9ca3af"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="At least 6 characters"
                                placeholderTextColor="#9ca3af"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Register Button */}
                        <Pressable style={styles.registerButton} onPress={handleAccountCreation}>
                            <Text style={styles.registerButtonText}>Create account</Text>
                            <Feather name="chevron-right" size={20} color="#fff" style={styles.arrowIcon} />
                        </Pressable>
                    </View>

                    {/* Footer Login Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already a member? </Text>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginLinkText}>Log in</Text>
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
        backgroundColor: "#FAF8F5", // Matching warm cream background
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
        marginTop: 10,
    },
    iconBox: {
        backgroundColor: "#f87171", // Coral-red icon badge
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#f87171",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    welcomeSubtitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#f87171",
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#6b7280",
        lineHeight: 20,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: "#111827",
    },
    registerButton: {
        backgroundColor: "#18181b", // Sleek dark button
        borderRadius: 14,
        height: 54,
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
    registerButtonText: {
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
        marginBottom: 5,
    },
    footerText: {
        color: "#6b7280",
        fontSize: 14,
    },
    loginLinkText: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});