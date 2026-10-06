use crate::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct SignUpRequest {
    full_name: String,
    login: String,
    password: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SignInRequest {
    login: String,
    password: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SignUpResponse {
    pub tokens: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MeResponse {
    pub full_name: String,
    pub uuid: String,
    pub stars: usize,
}

pub type SignInResponse = SignUpResponse;

#[derive(Debug, Deserialize, Serialize)]
pub struct Tokens {
    pub access_token: String,
    pub refresh_token: String,
}
