import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = req.body;
  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  // Find the user by email
  const user = await findUserByEmail(body.email);

  if (!user)
    return reply.code(401).send({ message: "Invalid email or password" });
  // verify password
  const correctPassword = verifyPassword(
    body.password,
    user.salt,
    user.password
  );
  // Generate token
  if (correctPassword) {
    const { password, salt, ...rest } = user;

    return { accessToken: server.jwt.sign(rest) };
  }
  // Respond
  return reply.code(401).send({ message: "Invalid email or password" });
}
