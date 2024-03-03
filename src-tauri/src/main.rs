#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod session;
use crate::session::*;
use std::{fs, io::{self, Read, Write}, path::Path};
use rusqlite::{Connection, params};
use std::result::Result as StdResult;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn write_to_file(filename: &str, data: &str) -> Result<(), String> {
    let mut file = std::fs::File::create(filename)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    file.write_all(data.as_bytes())
        .map_err(|e| format!("Failed to write to file: {}", e))?;

    Ok(())
}

#[tauri::command]
fn start_session (description: String) -> Result<(), String> {
    let new_session = Session::new(description);

    let json = serde_json::to_string(&new_session)
        .map_err(|e| format!("Failed to serialize session: {}", e))?;

    write_to_file("/Users/henry/code/p/time-track/src-tauri/session.json", &json)?;

    println!("Session created");
    Ok(())
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
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, start_session])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
