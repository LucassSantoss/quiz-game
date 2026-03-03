import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("data.db");

export async function createTableIfNotExists() {
    await db.execAsync(`CREATE TABLE IF NOT EXISTS questions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            option1 TEXT,
            option2 TEXT,
            answerNumber INTEGER
        );`);
}

export async function insertQuestionsIfNotExists() {
    const questions = await getQuestions();
    if (questions.length > 0) return;

    const data = [
        ["Onde fica o Brasil?", "Europa", "América do Sul", 2],
        ["Capital da França?", "Paris", "Roma", 1],
        ["2 + 2 =", "3", "4", 2],
        ["O Sol é...", "Planeta", "Estrela", 2],
        ["Maior oceano?", "Pacífico", "Atlântico", 1],
        ["Linguagem do React?", "JavaScript", "Python", 1],
        ["Animal que mia?", "Cachorro", "Gato", 2],
        ["Planeta vermelho?", "Marte", "Vênus", 1],
        ["5 x 2 =", "10", "8", 1],
        ["Cor do céu limpo?", "Azul", "Verde", 1],
        ["Capital do Brasil?", "Brasília", "Rio de Janeiro", 1],
        ["3 x 3 =", "6", "9", 2],
        ["Mamífero?", "Baleia", "Tubarão", 1],
        ["CSS serve para...", "Estilo de página", "Banco de dados", 1],
        ["Maior planeta?", "Júpiter", "Marte", 1],
        ["Rio famoso do Egito?", "Nilo", "Amazonas", 1],
        ["7 - 4 =", "3", "5", 1],
        ["Sistema operacional?", "Linux", "Google", 1],
        ["Água ferve a...", "100°C", "50°C", 1],
        ["Animal que voa?", "Galinha", "Águia", 2],
        ["Linguagem de programação?", "Java", "HTML", 1],
        ["Continente do Japão?", "Ásia", "África", 1],
        ["10 / 2 =", "3", "5", 2],
        ["Maior floresta?", "Amazônica", "Saara", 1],
        ["Navegador web?", "Chrome", "Windows", 1],
        ["Planeta mais próximo do Sol?", "Mercúrio", "Terra", 1],
        ["4 x 5 =", "20", "25", 1],
        ["Banco de dados?", "SQLite", "React", 1],
        ["Cor do sangue?", "Vermelho", "Azul", 1],
        ["Lua é um...", "Satélite", "Planeta", 1],
    ];

    for (const [question, option1, option2, answerNumber] of data) {
        await db.runAsync(
            `INSERT INTO questions (question, option1, option2, answerNumber) VALUES (?, ?, ?, ?);`,
            [question, option1, option2, answerNumber],
        );
    }
}

export async function getQuestions() {
    const result = await db.getAllAsync("SELECT * FROM questions;");
    return result;
}
