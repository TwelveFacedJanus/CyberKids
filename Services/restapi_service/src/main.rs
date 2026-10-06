
use actix_web::{App, HttpServer, get, web, post, Responder, HttpRequest, HttpResponse, Result as AResult};
use actix_web::middleware::Logger;

use env_logger::Env;

use serde::{Deserialize, Serialize};

mod schemas;
use schemas::{ResponseObject, user_schema};

mod routers;
use routers::devroute::get_health;
use routers::authroute::{sign_in, sign_up, get_me};


#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
            .service(
                web::scope("/dev")
                    .service(get_health)
            )
            .service(
                web::scope("/api/v1/auth")
                    .service(sign_in)
                    .service(sign_up)
                    .service(get_me)
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
