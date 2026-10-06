use crate::{post, get, HttpResponse, ResponseObject, user_schema, AResult, web, Responder};

#[post("/sign_in")]
pub async fn sign_in(creds: web::Json<user_schema::SignInRequest>) -> AResult<impl Responder>
{
    let response = user_schema::Tokens { access_token: "Hello, World!".to_string(), refresh_token: "Hello2".to_string()};
    let result = ResponseObject::<user_schema::Tokens>::new(200u32, response);
    Ok(web::Json(result))
}

#[post("/sign_up")]
pub async fn sign_up(creds: web::Json<user_schema::SignUpRequest>) -> AResult<impl Responder>
{
    let response = user_schema::Tokens { access_token: "Hello, World!".to_string(), refresh_token: "Hello2".to_string()};
    let result = ResponseObject::<user_schema::Tokens>::new(200u32, response);
    Ok(web::Json(result))
}

#[get("/me/{uid}")]
pub async fn get_me(req: web::Path<String>) -> AResult<impl Responder>
{
    let response = user_schema::MeResponse { full_name: "Иванов Иван Иванович".to_string(), uuid: "Hello, World!".to_string(), stars: 64usize};
    let result = ResponseObject::<user_schema::MeResponse>::new(200u32, response);
    Ok(web::Json(result))
}
