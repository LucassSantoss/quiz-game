import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
    createTableIfNotExists,
    getQuestions,
    insertQuestionsIfNotExists,
} from "./src/db/sqliteDatabaseService";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const load = async () => {
            await createTableIfNotExists();
            await insertQuestionsIfNotExists();

            const questions = await getQuestions();
            setQuestions(questions);

            console.log(questions);
        };

        load();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <StatusBar />
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Iniciar Jogo</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
