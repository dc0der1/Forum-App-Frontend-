import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

import LoginScreen from "../screens/LoginScreen.js";
import Forums from "../screens/Forums.js";
import RegisterScreen from "../screens/RegisterScreen.js";
import { Pressable } from "react-native";

export default function RootNavigator() {

    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen}
                    options={{
                        title: "Login", 
                        headerBackVisible: false, 
                    }}
                />

                <Stack.Screen 
                    name="Forums" 
                    component={Forums} 
                    options={({ navigation}) => ({
                        title: "Commonly", 
                        headerBackVisible: false, 
                        headerRight: () => (
                            <Pressable 
                                onPress={async () => {
                                await SecureStore.deleteItemAsync("userToken");

                                navigation.replace("Login");
                                }}
                            >
                                <Ionicons name="log-out-outline" size={18} color=""/>
                            </Pressable>
                        )
                    })}
                />

                <Stack.Screen 
                    name="Register" 
                    component={RegisterScreen} 
                    options={{
                        title: "Register"
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}