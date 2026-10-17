import { FlatList, Pressable, StyleSheet, Text, View, SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import H1 from "../components/H1.js";
import { AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

export default function Forums({ navigation }) {

    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("Latest");

    useEffect(() => {
        getAllPosts();
    }, [])

    async function postForum() {
        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch("http://10.0.2.2:8080/api/forum/create", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }, 
                body: JSON.stringify({
                    postTitle: "Hi from mobile!", 
                    postContent: "This is a post request from mobile", 
                    category: "General"
                })

            });

            const data = await response.json();

            console.log(`Forum posted successfully!`);

            getAllPosts();
        } catch (error) {
            console.log(error);
        }

    }

    async function getAllPosts() {
        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch("http://10.0.2.2:8080/api/forum/all", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Something went wrong while loading the posts!");
            }

            const data = await response.json();
            setPosts(data);

            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const Item = ({ post }) => {
        // Generates user initials for avatar badge (e.g. "Henry" -> "H")
        const initials = post.userResponse?.username 
            ? post.userResponse.username.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
            : "U";

        return (
            <View style={styles.card}>
                {/* Author Info & Category */}
                <View style={styles.topPost}>
                    <View style={styles.authorRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <View>
                            <Text style={styles.username}>{post.userResponse?.username || "Anonymous"}</Text>
                            <Text style={styles.postTime}>@{post.userResponse?.username?.toLowerCase() || "user"}</Text>
                        </View>
                    </View>
                    <View style={styles.postCategory}>
                        <Text style={styles.categoryText}>{post.postCategory || "GENERAL"}</Text>
                    </View>
                </View>

                {/* Post Title & Content */}
                <Text style={styles.postTitle}>{post.postTitle}</Text>
                <Text style={styles.postContent} numberOfLines={3}>{post.postContent}</Text>

                {/* Interaction Buttons Footer */}
                <View style={styles.bottomPost}>
                    <Pressable style={styles.likeAndReplyButtons}>
                        <AntDesign name="heart" color="#f87171" size={16}/>
                        <Text style={styles.buttonCountText}>{post.likeCount}</Text>
                    </Pressable>

                    <Pressable 
                        style={styles.likeAndReplyButtons}
                        onPress={() => navigation.navigate("Post", { postItem: post })}
                    >
                        <MaterialCommunityIcons name="message-outline" color="#4b5563" size={16}/>
                        <Text style={styles.buttonCountText}>{post.replyCount}</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList 
                    data={posts}
                    renderItem={({item}) => <Item post={item}/>} 
                    keyExtractor={item => item.postId} 
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            <Text style={styles.subtitle}>YOUR COMMUNITY FEED</Text>
                            <Text style={styles.mainTitle}>What's happening?</Text>

                            {/* Filter Tabs */}
                            <View style={styles.tabRow}>
                                {["Latest", "Popular", "Topics"].map((tab) => (
                                    <Pressable 
                                        key={tab} 
                                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                                        onPress={() => setActiveTab(tab)}
                                    >
                                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                            {tab}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    }
                />

                {/* Floating Create Post Button */}
                <Pressable style={styles.floatingButton} onPress={() => navigation.navigate("CreatePost")}>
                    <Feather name="plus" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.floatingButtonText}>Create post</Text>
                </Pressable>
            </View>
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
        paddingHorizontal: 16,
    },
    headerContainer: {
        paddingVertical: 10,
    },
    subtitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#f87171",
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    tabRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: "#18181b",
        borderColor: "#18181b",
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4b5563",
    },
    activeTabText: {
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    topPost: {
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
        width: 36,
        height: 36,
        borderRadius: 18,
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
    username: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#111827",
    },
    postTime: {
        fontSize: 11,
        color: "#9ca3af",
    },
    postCategory: {
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
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 6,
        lineHeight: 22,
    },
    postContent: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
        marginBottom: 14,
    },
    bottomPost: {
        flexDirection: "row",
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
        paddingTop: 12,
    },
    likeAndReplyButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5, 
        backgroundColor: "#f9fafb",
        borderWidth: 1, 
        borderColor: "#f3f4f6", 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 12
    },
    buttonCountText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4b5563",
    },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#f87171",
        flexDirection: "row",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#f87171",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    floatingButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    }
});