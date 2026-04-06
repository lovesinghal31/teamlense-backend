import { prisma } from "@/lib/prisma.js";

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
        password: true,
      },
    });
  }
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
      },
    });
  }
  async createUser(
    name: string,
    email: string,
    password: string,
    skills: string,
  ) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
        skills,
      },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
      },
    });
  }
}
