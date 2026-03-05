import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import {
    createTableIfNotExists,
    getQuestions,
    insertQuestionsIfNotExists,
} from "./src/db/sqliteDatabaseService";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    const [questions, setQuestions] = useState([]);
    const backgroundImageLink =
        "https://images.unsplash.com/photo-1771780381425-377055add090?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    useEffect(() => {
        const load = async () => {
            await createTableIfNotExists();
            await insertQuestionsIfNotExists();

            const questions = await getQuestions();
            setQuestions(questions);

            // console.log(questions);
        };

        load();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <StatusBar />
                <ImageBackground
                    source={{
                        uri: backgroundImageLink,
                    }}
                    style={styles.container}
                    resizeMode="cover"
                >
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Iniciar Jogo</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
