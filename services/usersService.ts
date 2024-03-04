import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

interface UserObjInterface {
  id: string;
  name: string;
  role: string;
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
export const findUser = async (db: SQLiteDatabase) => {
  let result;
  try {
    await db.transactionAsync(async (tx) => {
      result = await tx.executeSqlAsync("SELECT * FROM USERS", []);
    }, readOnly);
  } catch (error) {
    console.log(error);
  }
  //   console.log("----", result.rows);
  return result;
};

export const createUsersTable = async (db: SQLiteDatabase) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists users (id text primary key not null, name text, role text);"
      );
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addUser = async (
  db: SQLiteDatabase,
  userObj: UserObjInterface
) => {
  const { id, name, role } = userObj;
  try {
    db.transaction((tx) => {
      tx.executeSql("insert into users (id, name, role) values (?, ?, ?)", [
        id,
        name,
        role,
      ]);
    });
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};
