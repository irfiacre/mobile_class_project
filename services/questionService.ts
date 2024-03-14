import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

interface QuestionObjInterface {
  id: string;
  quizId: string;
  question: string;
  questionType: string;
}

export const openDatabase = (): any => {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return { executeSql: () => {} };
      },
    };
  }

  const db = SQLite.openDatabase("testDB");
  return db;
};

const readOnly = true;
export const findQuestionData = async (
  db: SQLiteDatabase,
  handleFoundData: (data: any) => void
) => {
  let result;
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync("select * from questions", []);
      if (result.rows) {
        handleFoundData(result.rows);
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const createQuestionTable = async (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists questions (id text primary key not null, quiz_id text, question text, type text);"
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addQuestion = async (
  db: SQLiteDatabase,
  quizObj: QuestionObjInterface
) => {
  const { id, quizId, question, questionType } = quizObj;
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into questions (id, quiz_id, question, type) values (?, ?, ?,?)",
        [id, quizId, question, questionType]
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const dropTableQuestion = (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE questions");
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const findQuizQuestionsById = async (
  db: SQLiteDatabase,
  quizId: string,
  handleFoundData: (data: any) => void
) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        "select * from questions where quiz_id=?",
        [quizId]
      );
      if (result.rows) {
        handleFoundData(result.rows);
      } else {
        console.log("No result.rows");
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
};

export const findQuestionById = async (
  db: SQLiteDatabase,
  questionId: string,
  handleFoundData: (data: any) => void
) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        "select * from questions where id=?",
        [questionId]
      );

      if (result.rows) {
        handleFoundData(result.rows);
      } else {
        console.log("No result.rows");
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestionById = async (
  db: SQLiteDatabase,
  questionId: string
) => {
  let recordDeleted = false;
  try {
    await db.transaction((tx) => {
      tx.executeSql("delete from questions where id=?", [questionId]);
    });
    recordDeleted = true;
  } catch (error) {
    console.log(error);
  }
  return recordDeleted;
};

export const updateQuestion = async (
  db: SQLiteDatabase,
  quizObj: { id: string; question: string }
) => {
  const { id, question } = quizObj;
  try {
    db.transaction((tx) => {
      tx.executeSql("update questions set question=? where id=?", [
        question,
        id,
      ]);
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
