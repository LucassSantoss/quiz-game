import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  createTableIfNotExists,
  getQuestions,
  insertQuestionsIfNotExists,
} from "./src/db/sqliteDatabaseService";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    await createTableIfNotExists();
    await insertQuestionsIfNotExists();
    const allQuestions = await getQuestions();
    
    // Randomiza e pega só 10
    const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
  };

  const selectAnswer = (answer) => {
    const currentQuestion = questions[currentIndex];
    const correctAnswer = currentQuestion.answerNumber === 1 ? 
      currentQuestion.option1 : currentQuestion.option2;

    const newScore = score + (answer === correctAnswer ? 1 : 0);
    setScore(newScore);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameFinished(true);
      Alert.alert(
        "🏆 Fim do Quiz!",
        `Você acertou ${newScore} de ${questions.length} (${Math.round(newScore/questions.length*100)}%)`,
        [{ text: "Jogar Novamente", onPress: restart }]
      );
    }
  };

  const startQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameStarted(true);
    setGameFinished(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameStarted(false);
    setGameFinished(false);
  };

  if (!questions.length) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" backgroundColor="transparent" translucent />
          <Text style={styles.loading}>Carregando...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1771780381425-377055add090?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
          style={styles.background}
          blurRadius={1}
        >
          <View style={styles.overlay}>
            {!gameStarted ? (
              <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
                <Text style={styles.startText}>Iniciar Quiz (10 perguntas)</Text>
              </TouchableOpacity>
            ) : !gameFinished ? (
              <View style={styles.quizContainer}>
                <Text style={styles.progress}>
                  {currentIndex + 1}/10
                </Text>
                <Text style={styles.question}>
                  {questions[currentIndex]?.question}
                </Text>
                <TouchableOpacity
                  style={styles.answerButton}
                  onPress={() => selectAnswer(questions[currentIndex]?.option1)}
                >
                  <Text style={styles.answerText}>
                    A) {questions[currentIndex]?.option1}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.answerButton, styles.answerButton2]}
                  onPress={() => selectAnswer(questions[currentIndex]?.option2)}
                >
                  <Text style={styles.answerText}>
                    B) {questions[currentIndex]?.option2}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
    loading: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    startButton: {
        backgroundColor: "#FFD700",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    startText: {
        color: "#1e3c72",
        fontSize: 18,
        fontWeight: "bold",
    },
    progress: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 16,
        fontWeight: "600",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
    },
    quizContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    question: {
        backgroundColor: "#1e3c72",
        color: "white",
        fontSize: 20,
        fontWeight: "700",
        paddingVertical: 50,
        borderRadius: 15,
        textAlign: "center",
        lineHeight: 28,
        minHeight: 120,
        maxWidth: "95%",
        width: "95%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 25,
    },
    answerButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 15,
        width: "100%",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    answerButton2: {
        backgroundColor: "#FF9800",
    },
    answerText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
    },
});
