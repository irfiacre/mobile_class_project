import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

interface QuizObjInterface {
  id: string;
  title: string;
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
export const findQuizData = async (
  db: SQLiteDatabase,
  handleFoundData: (data: any) => void
) => {
  let result;
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync("SELECT * FROM QUIZZES", []);
      if (result.rows) {
        handleFoundData(result.rows);
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const createQuizTable = async (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists quizzes (id text primary key not null, title text, status text);"
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addQuiz = async (
  db: SQLiteDatabase,
  quizObj: QuizObjInterface
) => {
  const { id, title } = quizObj;
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into quizzes (id, title, status) values (?, ?, ?)",
        [id, title, "draft"]
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const dropTableQuiz = (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE quizzes");
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const findQuizById = async (
  db: SQLiteDatabase,
  quizId: string,
  handleFoundData: (data: any) => void
) => {
  try {
    await db.transactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(
        "select * from quizzes where id=?",
        [quizId]
      );
      if (result.rows) {
        handleFoundData(result.rows);
      }
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
};

export const updateQuiz = async (
  db: SQLiteDatabase,
  quizObj: { id: string; newStatus: string; newTitle: string }
) => {
  const { id, newStatus, newTitle } = quizObj;
  try {
    db.transaction((tx) => {
      tx.executeSql("update quizzes set title=?, status=? where id=?", [
        newTitle,
        newStatus,
        id,
      ]);
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteQuizById = async (db: SQLiteDatabase, quizId: string) => {
  let recordDeleted = false;
  try {
    await db.transaction((tx) => {
      tx.executeSql("delete from quizzes where id=?", [quizId]);
    });
    recordDeleted = true;
  } catch (error) {
    console.log(error);
  }
  return recordDeleted;
};
