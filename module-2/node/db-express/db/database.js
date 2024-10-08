// hier brauchen wir die logik
// für die interaktion mit der datenbank

// wir müssen die datei definieren todos.db
// dann eine connection mit dieser datei aufbauen
// dann können wir in die datei todos inserten
// löschen, update, usw.... 

import sqlite3 from 'sqlite3';

const dbFile = "./db/todos.db";

export function initializeDatabase() {
    console.log("Die Datenbank wird initialisiert...")
    const db = new sqlite3.Database(dbFile, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
            db.run(`CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Table "todos" is ready.');
                }
            });
        }
    });

    return db;
}
export function getTodosFromDB(db) {
    const query = 'SELECT * FROM todos';
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error fetching todos:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export async function addTodoToDB(db, task) {
    const query = 'INSERT INTO todos (task) VALUES (?)';
    return new Promise((resolve, reject) => {
        db.run(query, [task], function(err) {
            if (err) {
                console.error('Error inserting todo:', err.message);
                reject(err);
            } else {
                resolve({ id: this.lastID, task });
            }
        });
    });
}