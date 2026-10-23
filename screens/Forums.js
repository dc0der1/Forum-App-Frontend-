import { FlatList, Pressable, StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { AntDesign, MaterialCommunityIcons, Feather, EvilIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

const categoryData = [
    { label: "Discussion", value: "Discussion" },
    { label: "Design", value: "Design" },
    { label: "Questions", value: "Questions" },
    { label: "Show & Tell", value: "Show & Tell" },
    { label: "General", value: "General" },
];

export default function Forums({ navigation }) {

    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("");
    const [page, setPage] = useState(0);
    const [currentUserId, setCurrentUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [category, setCategory] = useState("Topics");

    useFocusEffect(
            useCallback(() => {
                async function initializeScreen() {
                    const username = await SecureStore.getItemAsync("userId");
                    setCurrentUserId(username || "");

                    setPage(0);
                    setHasMore(true);
                    getAllPosts(0, true);
                }
                initializeScreen();
            }, [])   
    );
    
    async function getAllPosts(pageNumber = 0, shouldReset = false) {
        if (loading || (!hasMore && !shouldReset)) return;

        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch(`http://10.0.2.2:8080/api/forum/all?page=${pageNumber}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (data.length === 0) {
                setHasMore(false);
            }

            if (shouldReset) {
                setPosts(data);
            } else {
                setPosts(prevPosts => {
                    const existingIds = new Set(prevPosts.map(p => p.postId));
                    const uniqueNewPosts = data.filter(p => !existingIds.has(p.postId));
                    const combined = [...prevPosts, ...uniqueNewPosts];
                    setAllPosts(combined);
                    return combined;
                });
            }

            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            getAllPosts(nextPage, false);
        }
    };

    async function likeAPost({ postId }) {
        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch(`http://10.0.2.2:8080/api/forum/like?forumPostId=${postId}`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("Successfully liked a post!");

            if (!response.ok) {
                throw new Error("Something went wrong while liking the post!");
            }

            setPage(0);
            setHasMore(true);
            getAllPosts(0, true);
        } catch (error) {
            console.log(error);
        }
    }

    async function deletePost(postId) {
        try {
            const token = await SecureStore.getItemAsync("userToken");

            const response = await fetch(`http://10.0.2.2:8080/api/forum/delete?forumPostId=${postId}`, {
                method: "DELETE", 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }); 

            if (!response.ok) throw new Error("Failed to delete post");

            setPage(0);
            setHasMore(true);
            getAllPosts(0, true);
        } catch (error) {
            console.error(error);
        }
    }

    const Item = ({ post }) => {
        // Generates user initials for avatar badge (e.g. "Henry" -> "H")
        const initials = post.userResponse?.username 
            ? post.userResponse.username.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
            : "U";

        const isOwner = post.userResponse?.userId === currentUserId;

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
                    <Pressable style={styles.likeAndReplyButtons} onPress={() => likeAPost(post)}
                        android_ripple={{backgroundColor: "gray"}}
                    >
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

                    {isOwner && (
                        <Pressable
                            onPress={() => deletePost(post.postId)}
                            style={styles.deleteButton}
                        >
                            <Feather name="trash-2" size={16} color={"#ef4444"}/>
                        </Pressable>
                    )}

                    {isOwner && (
                        <Pressable 
                            style={styles.deleteButton}
                            onPress={() => navigation.navigate("EditPost", {postItem: post})}
                        >
                            <EvilIcons name="pencil" size={16} color="orange"/>
                        </Pressable>
                    )}
                </View>
            </View>
        );
    };

    function filter(tab, selectedCategory) {

        const targetCategory = selectedCategory !== undefined ? selectedCategory : category;

        if (tab === "Popular") {
            const sorted = [...allPosts].sort((a, b) => {
                const scoreA = (a.likeCount || 0) + (a.replyCount || 0); 
                const scoreB = (b.likeCount || 0) + (b.replyCount || 0);
                return scoreB - scoreA;
            });
            setPosts(sorted);
            return;
        } 
        
        // This sort is based of the day differences and not hour, seconds or milli seconds
        if (tab === "Latest" || activeTab === "Latest") {
            const latest = [...allPosts].sort((a, b) => {
                const dateA = new Date(a.postedAt || 0).getTime();
                const dateB = new Date(b.postedAt || 0).getTime();
                return dateB - dateA;
            });
            setPosts(latest);
            return;
        }

        if (tab === "Topics") {
            const filtered = allPosts.filter((post) => post.postCategory === targetCategory);
            setPosts(filtered);
            return;
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList 
                    data={posts}
                    renderItem={({item}) => <Item post={item}/>} 
                    keyExtractor={item => item.postId} 
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.emptyTextContainer}>
                                <Text style={styles.emptyText}>No forums are posted!{"\n"}Be the first to post!</Text>
                            </View>
                        )
                    }
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            <Text style={styles.subtitle}>YOUR COMMUNITY FEED</Text>
                            <Text style={styles.mainTitle}>What's happening?</Text>

                            {/* Filter Tabs */}
                            <View style={styles.tabRow}>
                                {["Latest", "Popular"].map((tab) => (
                                    <Pressable 
                                        key={tab} 
                                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                                        onPress={() => {setActiveTab(tab); filter(tab); setCategory("Topics")}}
                                    >
                                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                            {tab}
                                        </Text>
                                    </Pressable>
                                ))}

                                <Dropdown
                                    style={[styles.dropdown]}
                                    containerStyle={styles.dropdownContainer}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    iconStyle={styles.iconStyle}
                                    itemTextStyle={styles.iconStyle}
                                    data={categoryData}
                                    labelField="label"
                                    valueField="value" 
                                    value={category}
                                    placeholder={category}
                                    onFocus={() => setActiveTab("Topics")}
                                    onChange={item => {
                                        setCategory(item.value);
                                        filter(activeTab, item.value);
                                    }}
                                />
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
    deleteButton: { 
        padding: 6, 
        backgroundColor: "#ffeeef", 
        borderRadius: 10 
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
    }, 
    emptyTextContainer: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    }, 
    emptyText: {
        fontSize: 24, 
        color: "gray", 
        fontWeight: "bold"
    }, 
    dropdown: {
        flex: 1, // Let it fill remaining space nicely alongside tabs
        height: 38, // Match the height of your filter tabs
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingHorizontal: 14,
    },
    placeholderStyle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4b5563",
    },
    selectedTextStyle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4b5563",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    dropdownContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        marginTop: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemTextStyle: {
        fontSize: 13,
        color: "#4b5563",
        fontWeight: "500",
    },
});