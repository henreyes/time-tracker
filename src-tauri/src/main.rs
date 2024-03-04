#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod session;
use crate::session::*;
use rusqlite::{Connection, params};
use std::result::Result as StdResult;
use chrono::{DateTime, Utc};

#[tauri::command]
fn get_sessions() -> Result<String, String> {
    let conn = Connection::open("sessions.db").map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, description, start_time, end_time, hours_worked FROM sessions ORDER BY id DESC")
        .map_err(|e| e.to_string())?;

    let sessions_iter = stmt
        .query_map([], |row| {
            let end_time: Option<String> = row.get(3)?;
            let parsed_end_time = match end_time {
                Some(et) => Some(DateTime::parse_from_rfc3339(&et).unwrap().with_timezone(&Utc)),
                None => None,
            };
            Ok(Session {
                id: row.get(0)?,
                description: row.get(1)?,
                start_time: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?).unwrap().with_timezone(&Utc),
                end_time: parsed_end_time,
                hours_worked: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let sessions: Result<Vec<Session>, _> = sessions_iter.collect();
    match sessions {
        Ok(sessions) => {
            for session in &sessions {
                println!("{}", session);
            }
            serde_json::to_string(&sessions).map_err(|e| e.to_string())},
        Err(e) => Err(e.to_string()),
    }
}


fn init_db() -> StdResult<(), String> {
    let conn = Connection::open("sessions.db").map_err(|e| format!("Failed to open database: {}", e))?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY,
            description TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT,
            hours_worked REAL
        )",
        [],
    ).map_err(|e| format!("Failed to create table: {}", e))?;

    Ok(())
}

#[tauri::command]
fn start_session(description: String) -> Result<i32, String> {
    let conn = Connection::open("sessions.db").map_err(|e| e.to_string())?;
    let session = Session::new(description);

  
    conn.execute(
        "INSERT INTO sessions (description, start_time) VALUES (?1, ?2)",
        params![
            session.description,
            session.start_time.to_rfc3339(),
        ],
    ).map_err(|e| e.to_string())?;

   
    let id = conn.last_insert_rowid() as i32;
    
    Ok(id) 
}

#[tauri::command]
fn end_session(id: i32) -> Result<(), String> {
    let conn = Connection::open("sessions.db").map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE sessions SET end_time = ?1 WHERE id = ?2",
        params![
            Utc::now().to_rfc3339(),
            id,
        ],
    ).map_err(|e| e.to_string())?;
    Ok(())
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ start_session, end_session, get_sessions])
        .setup(|_| {
            init_db().expect("Failed to initialize the database");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
