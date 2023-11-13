import { cors } from "@elysiajs/cors";
import { Elysia, NotFoundError } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";

import knex from "./knex.config/db.setup";

import { itemsRoute } from "./routers/items";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Elysia documentation",
          version: "0.1.0",
        },
      },
    })
  )
  .use(staticPlugin())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .use(cors());
  
  app.onError(({ code, error, set }) => {
    const errData: any = {
      ok: false,
      error: error.toString()
    }
    // set.status = 500;
    return errData;
    // return new Response(JSON.stringify(), {
    //   headers: {
    //       'Content-Type': 'application/json'
    //   }
    // });
  });

  app.decorate("db", knex);
  app.group('/api', (app: Elysia) =>
    app
      .use(itemsRoute)
      // and other controllers
  );
  app.get("/", () => "Hello Elysia");
  app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
