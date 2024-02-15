package com.justirfan.projects.java.vertxstarter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.MultiMap;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Date;


public class MainVerticle extends AbstractVerticle {
  private final Logger logger = LoggerFactory.getLogger(MainVerticle.class);
  private boolean tock = false;

  @Override
  public void start(Promise<Void> startPromise) throws Exception {
    Router router = Router.router(vertx);

    vertx.setPeriodic(2000, id -> {
      String message = tock?"Tock":"Tick";
      logger.info(message);
      tock = !tock;
    });

    router.route().handler(context -> {
      // get the address
      String address = context.request().connection().remoteAddress().toString();
      logger.info("Got address: {}", address);

      // get the query parameter name
      MultiMap queryParams = context.queryParams();
      logger.info("All query Params: {} ", queryParams.toString());
      String name = queryParams.contains("name")?queryParams.get("name"):" friend!!";

      context.json( new JsonObject().put("name", name).put("address", address).put("message",
        "Hello there " + name + " connecting from " + address));
    });


    vertx.createHttpServer()
      .requestHandler(router)
      .listen(8888, http -> {
        if (http.succeeded()) {
          startPromise.complete();
          System.out.println("HTTP server started on port 8888");
        } else {
          startPromise.fail(http.cause());
        }
      });
  }
}
