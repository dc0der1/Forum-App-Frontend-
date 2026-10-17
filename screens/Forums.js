import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { container } from "../constants/container.js";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import H1 from "../components/H1.js";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Forums() {

    const [posts, setPosts] = useState([]);

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

    const Item = ({post}) => (
        <View style={styles.forumContainer}>
            <View style={styles.topPost}>
                <Text style={styles.username}>{post.userResponse.username}</Text>
                <Text style={styles.postCategory}>{post.postCategory}</Text>
            </View>

            <Text style={styles.postTitle}>{post.postTitle}</Text>
            <Text style={styles.postContent}>{post.postContent}</Text>

            <View style={styles.bottomPost}>
                <Pressable style={styles.likeAndReplyButtons}>
                    <AntDesign name="heart" color="#F00" size={18}/>
                    <Text>{post.likeCount}</Text>
                </Pressable>

                <Pressable style={styles.likeAndReplyButtons}>
                    <MaterialCommunityIcons name="message" color="#000" size={18}/>
                    <Text>{post.replyCount}</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.forumContainer}>
            <FlatList 
                data={posts}
                renderItem={({item}) => <Item post={item}/>} 
                keyExtractor={item => item.postId} 
                ListHeaderComponent={
                    <View>
                        <H1 text={"What's happening?"}/>
                    </View>
                }
            />

            <Pressable style={styles.postButton} onPress={postForum}>
                <Text>Create Post</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    forumContainer: {
        marginHorizontal: 10, 
        marginBottom: 20
    }, 
    postTitle: {
        flex: 1, 
        fontSize: 24, 
        fontWeight: "bold"
    }, 
    postContent: {
        flex: 1, 
        opacity: 0.6
    }, 
    topPost: {
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "space-between"
    }, 
    username: {
        fontWeight: "bold"
    }, 
    postCategory: {
        backgroundColor: "lightgray", 
        paddingHorizontal: 10, 
        borderRadius: 100
    }, 
    bottomPost: {
        flex: 1, 
        flexDirection: "row", 
        gap: 10
    }, 
    likeAndReplyButtons: {
        flexDirection: "row", 
        gap: 5, 
        borderWidth: 1, 
        borderColor: "lightgray", 
        paddingHorizontal: 15, 
        paddingVertical: 5, 
        borderRadius: 100
    }, 
    postButton: {
        flex: 0, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "orange", 
        marginBottom: 50
    }
});