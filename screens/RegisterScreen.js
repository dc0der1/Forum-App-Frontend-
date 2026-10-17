import { Pressable, TextInput, View, Text } from "react-native"
import { input } from "../constants/input.js";
import { useState } from "react";

export default function RegisterScreen() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            console.log("Account created successfully");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View>
            <TextInput style={input}
                placeholder="Enter your username" 
                onChangeText={setUsername}
            />
            <TextInput style={input}
                placeholder="Enter your email" 
                onChangeText={setEmail}
            />
            <TextInput style={input}
                placeholder="Enter your password" 
                onChangeText={setPassword}
            />
            <Pressable onPress={handleAccountCreation}>
                <Text>Create Account</Text>
            </Pressable>
        </View>
    )
}