import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Dropdown } from "react-native-element-dropdown";
import ErrorMessage from "../components/ErrorMessage";

const categoryData = [
    { label: "Discussion", value: "Discussion" },
    { label: "Design", value: "Design" },
    { label: "Questions", value: "Questions" },
    { label: "Show & Tell", value: "Show & Tell" },
    { label: "General", value: "General" },
];

export default function CreatePostModal({ navigation }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Discussion"); // Default category
    const [isFocus, setIsFocus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageColor, setErrorMessageColor] = useState("red");

    async function handleCreatePost() {
        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch("http://10.0.2.2:8080/api/forum/create", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }, 
                body: JSON.stringify({
                    postTitle: title, 
                    postContent: content, 
                    category: category
                })
            });

            if (!title || title.trim() === "" || 
                !content || content.trim() === "" || 
                !category || category.trim() === ""
            ) {
                setErrorMessage("Make sure your inputs aren't empty.");
                return;
            }

            if (!response.ok) setErrorMessage("Something went wrong.");

            console.log("Forum posted successfully!");
            setErrorMessage("Post successfully created!");
            setErrorMessageColor("green");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
            >
                {/* Modal Top Header Bar */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={24} color="#111827" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Start a conversation</Text>
                    <Pressable style={styles.postSubmitButton} onPress={handleCreatePost}>
                        <Text style={styles.postSubmitButtonText}>Post</Text>
                    </Pressable>
                </View>

                <ErrorMessage errorMessage={errorMessage} color={errorMessageColor}/>

                {/* Form Fields */}
                <View style={styles.formBody}>
                    {/* Topic Selection Container */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Topic</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: "#f87171" }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={categoryData}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select topic' : '...'}
                            value={category}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setCategory(item.value);
                                setIsFocus(false);
                            }}
                            renderRightIcon={() => (
                                <Feather name="chevron-down" size={18} color="#111827" />
                            )}
                        />
                    </View>

                    {/* Title Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput 
                            style={styles.titleInput}
                            placeholder="Give your post a clear title"
                            placeholderTextColor="#9ca3af"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Content Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>What’s on your mind?</Text>
                        <TextInput 
                            style={styles.contentInput}
                            placeholder="Share a thought, question, or discovery..."
                            placeholderTextColor="#9ca3af"
                            multiline={true}
                            textAlignVertical="top"
                            value={content}
                            onChangeText={setContent}
                        />
                    </View>
                </View>
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
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    postSubmitButton: {
        backgroundColor: "#d1d5db", // Muted gray until filled, can make dynamic later
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postSubmitButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    formBody: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 8,
    }, 
    dropdown: {
        height: 50,
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
    }, 
    dropdownBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dropdownText: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "500",
    },
    titleInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#f87171", // Highlight border matching Figma
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: "#111827",
    },
    contentInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: "#111827",
        height: 160,
    }
});