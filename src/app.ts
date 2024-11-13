import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import fjwt from "@fastify/jwt";
import { userSchemas } from "./modules/user/user.schema";

export const server = Fastify();
server.register(fjwt, {
  secret: "secret",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);
server.get("/healthcheck", async () => {
  return { status: "OK" };
});

async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, {
    prefix: "api/users",
  });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server ready at http://localhost:3000");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
