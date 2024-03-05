#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod session;
use crate::session::*;
use rusqlite::{Connection, params};
use std::result::Result as StdResult;
use chrono::{DateTime, Utc};

#[tauri::command]
fn get_sessions(start: String, end: String) -> Result<String, String> {
    let conn = Connection::open("sessions.db").map_err(|e| e.to_string())?;
    let sql = "
        SELECT id, description, start_time, end_time, hours_worked 
        FROM sessions WHERE start_time >= ?1 AND start_time <= ?2 ORDER BY id DESC";

    let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
    let sessions_iter = stmt.query_map(params![start, end], parse_sql_row).map_err(|e| e.to_string())?;

    let sessions: Result<Vec<Session>, _> = sessions_iter.collect();
    match sessions {
        Ok(sessions) => {
            serde_json::to_string(&sessions).map_err(|e| e.to_string())
        },
        Err(e) => Err(e.to_string()),
    }
}

fn parse_sql_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<Session> {
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
    let mut conn = Connection::open("sessions.db").map_err(|e| e.to_string())?;
    let tx = conn.transaction().map_err(|e| e.to_string())?;

    let start_time: String = tx.query_row(
        "SELECT start_time FROM sessions WHERE id = ?1",
        params![id],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    let start_time = DateTime::parse_from_rfc3339(&start_time).unwrap().with_timezone(&Utc);
    let end_time = Utc::now();
    let duration = end_time.signed_duration_since(start_time);
    let hours_worked = duration.num_seconds() as f64 / 3600.0;

    tx.execute(
        "UPDATE sessions SET end_time = ?1, hours_worked = ?2 WHERE id = ?3",
        params![
            end_time.to_rfc3339(),
            hours_worked,
            id,
        ],
    ).map_err(|e| e.to_string())?;

    tx.commit().map_err(|e| e.to_string())?;

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
