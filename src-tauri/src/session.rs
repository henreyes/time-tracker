use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

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
            id: None,
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