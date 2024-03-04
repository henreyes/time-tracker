use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use std::fmt;

#[derive(Serialize, Deserialize, Debug)]
pub struct Session {
    pub id: Option<u32>,
    pub description: String,
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub hours_worked: Option<f64>,
}

impl Session {
    pub fn new(description: String) -> Self {
        Session {
            id : None,
            description,
            start_time: Utc::now(),
            end_time: None,
            hours_worked: None,
        }
    }
    pub fn end(& mut self) {
        self.end_time = Some(Utc::now());
        
        let duration = self.end_time.expect("Error").signed_duration_since(self.start_time);
        self.hours_worked = Some(duration.num_seconds() as f64 / 3600.0);
    }
}

impl fmt::Display for Session {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Session {{ id: {}, description: {}, start_time: {}, end_time: {}, hours_worked: {} }}",
            self.id.map_or("None".to_string(), |id| id.to_string()),
            self.description,
            self.start_time,
            self.end_time.as_ref().map_or("In Progress".to_string(),|et| et.to_rfc3339()),
            self.hours_worked.map_or(0.0, |hw| hw)
        )
    }
}