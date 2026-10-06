use crate::{HttpResponse, get};

#[get("/health")]
pub async fn get_health() -> HttpResponse {
    HttpResponse::Ok().body(format!("Hello, World!"))
}
