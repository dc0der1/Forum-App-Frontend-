import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, Share } from "react-native";
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";

export default function ForumPost({ route, navigation }) {
    const { postItem } = route.params;
    const [replyText, setReplyText] = useState("");
    const [repliesList, setRepliesList] = useState(postItem.replies || []);

    // Helper for author initials avatar badge
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const authorInitials = getInitials(postItem.userResponse?.username);

    async function handleSendReply() {
        if (!replyText.trim()) return;

        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch(`http://10.0.2.2:8080/api/forum/reply?forumPostId=${postItem.postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    reply: replyText
                })
            });

            if (!response.ok) {
                throw new Error("Failed to send reply");
            }
            
            loadReplies();

            setReplyText(""); // Clear input
        } catch (error) {
            console.log(error);
        }
    }

    async function loadReplies() {

        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch(`http://10.0.2.2:8080/api/forum/replies?forumPostId=${postItem.postId}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            setRepliesList(data.replies);

        } catch (error) {
            console.log(error);
        }
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                title: `${postItem.userResponse.username} made a new post!`, 
                message: `Make sure to check it out! \nShared by ${postItem.userResponse.username}`, 
                url: "https://sponour.online" // Temporary link
            });

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    
                    {/* Main Post Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.authorRow}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{authorInitials}</Text>
                                </View>
                                <View>
                                    <Text style={styles.authorName}>{postItem.userResponse?.username}</Text>
                                    <Text style={styles.postTime}>Author</Text>
                                </View>
                            </View>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{postItem.postCategory || "GENERAL"}</Text>
                            </View>
                        </View>

                        <Text style={styles.postTitle}>{postItem.postTitle}</Text>
                        <Text style={styles.fullContentText}>{postItem.postContent}</Text>

                        {/* Metrics & Actions Footer */}
                        <View style={styles.cardFooter}>
                            <View style={styles.interactionGroup}>
                                <View style={styles.actionButton}>
                                    <AntDesign name="heart" color="#f87171" size={16}/>
                                    <Text style={styles.actionText}>{postItem.likeCount}</Text>
                                </View>
                                <View style={styles.actionButton}>
                                    <MaterialCommunityIcons name="message-outline" size={16} color="#4b5563" />
                                    <Text style={styles.actionText}>{repliesList.length} replies</Text>
                                </View>
                            </View>

                            <View style={styles.interactionGroup}>
                                <Feather name="bookmark" size={18} color="#4b5563" style={{ marginRight: 16 }} />
                                <Feather name="send" size={18} color="#4b5563" onPress={onShare}/> {/* Share button */}
                            </View>
                        </View>
                    </View>

                    {/* Conversation Header */}
                    <View style={styles.conversationHeaderRow}>
                        <Text style={styles.conversationTitle}>Conversation</Text>
                        <Text style={styles.topRepliesText}>TOP REPLIES</Text>
                    </View>

                    {/* Render Replies List */}
                    {repliesList.map((item) => {
                        const replyInitials = getInitials(item.userResponse?.username);

                        return (
                            <View key={item.replyId} style={styles.replyCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.authorRow}>
                                        <View style={[styles.avatar, { width: 32, height: 32, borderRadius: 16 }]}>
                                            <Text style={[styles.avatarText, { fontSize: 11 }]}>{replyInitials}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.authorName, { fontSize: 13 }]}>
                                                {item.userResponse?.username || "Anonymous"}
                                            </Text>
                                            <Text style={styles.postTime}>
                                                {item.createdAt ? item.createdAt.slice(0, 10) : ""}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.replyText}>{item.reply}</Text>
                                
                                <View style={styles.replyFooter}>
                                    <View style={styles.actionButton}>
                                        <MaterialCommunityIcons name="cards-diamond-outline" size={14} color="#4b5563" />
                                        <Text style={styles.actionText}>0</Text>
                                    </View>
                                    <Text style={styles.replyActionText}>Reply</Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Bottom Reply Input Bar */}
                <View style={styles.replyInputContainer}>
                    <View style={[styles.avatar, { width: 32, height: 32, borderRadius: 16, marginRight: 8 }]}>
                        <Text style={[styles.avatarText, { fontSize: 11 }]}>AM</Text>
                    </View>
                    <TextInput 
                        style={styles.replyInput}
                        placeholder="Add to the conversation..."
                        placeholderTextColor="#9ca3af"
                        value={replyText}
                        onChangeText={setReplyText}
                    />
                    <Pressable style={styles.sendButton} onPress={handleSendReply}>
                        <Feather name="send" size={16} color="#fff" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FAF8F5", // Warm cream canvas background
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#fee2e2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    avatarText: {
        fontWeight: "bold",
        color: "#991b1b",
        fontSize: 13,
    },
    authorName: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#111827",
    },
    postTime: {
        fontSize: 11,
        color: "#9ca3af",
    },
    categoryBadge: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4b5563",
        letterSpacing: 0.5,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 10,
        lineHeight: 26,
    },
    fullContentText: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 22,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
        paddingTop: 12,
    },
    interactionGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    actionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4b5563",
        marginLeft: 4,
    },
    conversationHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    conversationTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    topRepliesText: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#9ca3af",
        letterSpacing: 1,
    },
    replyCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#f3f4f6",
    },
    replyText: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
        marginBottom: 12,
    },
    replyFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    replyActionText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#4b5563",
    },
    replyInputContainer: {
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        alignItems: "center",
    },
    replyInput: {
        flex: 1,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: "#111827",
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: "#f87171",
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#f87171",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    }
});