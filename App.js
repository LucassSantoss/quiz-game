import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    createTableIfNotExists,
    getQuestions,
    insertQuestionsIfNotExists,
} from "./src/db/sqliteDatabaseService";

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
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
