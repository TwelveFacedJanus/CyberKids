pub mod user_schema;
use crate::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct ResponseObject<T> {
    status_code: u32,
    response: T,
}


impl<T> ResponseObject<T>
{
    pub fn new(status_code: u32, object: T) -> Self {
        Self { status_code, response: object }
    }
}
