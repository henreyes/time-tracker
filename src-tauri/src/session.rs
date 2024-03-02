use chrono::{DateTime, Utc};

struct Session {
    id: u32,
    description: String,
    start_time: DateTime<Utc>,
    end_time: Option<DateTime<Utc>>,
    hours_worked: Option<f64>,
}

impl Session {
    fn new(id: u32, description: String) -> Self {
        Session {
            id,
            description,
            start_time: Utc::now(),
            end_time: None,
            hours_worked: None,
        }
    }
    fn end(& mut self) {
        self.end_time = Some(Utc::now());
        
        let duration = self.end_time.expect("Error").signed_duration_since(self.start_time);
        self.hours_worked = Some(duration.num_seconds() as f64 / 3600.0);
    }
}