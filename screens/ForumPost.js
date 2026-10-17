import { useState } from "react";
import { Text, View } from "react-native";

export default function ForumPost({ route }) {

    const { postItem } = route.params;
    console.log(postItem.replies.map(({ reply, userResponse }) => {reply, userResponse.username}));

    return (
        <View>
            <Text>{postItem.postTitle}</Text>
            <Text>{postItem.postContent}</Text>
            <Text>Category: {postItem.postCategory}</Text>

            <Text>Replies</Text>
            
            {postItem.replies.map(({ reply, userResponse, createdAt}) => (
                <View>
                    <Text>{createdAt.slice(0, 10)}</Text>
                    <Text>{reply}</Text>
                    <Text>{userResponse.username}</Text>
                </View>
            ))}
        </View>
    );
}