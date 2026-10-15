import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import H1 from "../components/H1.js";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }) {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const response = await fetch("http://10.0.2.2:8080/api/user/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({ email: email, password: password})
            });

            if (!response.ok) {
                throw new Error("Invalid email or password!");
            }

            const data = await response.json();
            
            await SecureStore.setItemAsync("userToken", data.token);

            navigation.navigate("Forums");

            console.log("Login successful, token saved!");
        } catch (error) {
            console.error("Login failed: ", error);
        }
        
    }

    return (
        <View style={styles.container}>
            <H1 text={"Good to see you."} />
            <Text>Email</Text>
            <TextInput 
                style={styles.input} 
                placeholder="you@example.com"
                onChangeText={setEmail}
            />
            
            <Text>Password</Text>
            <TextInput 
                style={styles.input} 
                placeholder="At least 6 characters"
                onChangeText={setPassword}
            />
            <Pressable onPress={handleLogin}>
                <Text>Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  input: {
    borderWidth: 1, 
    borderColor: "black", 
    width: "auto"
  }
});