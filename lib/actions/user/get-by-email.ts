import { prisma } from "@/lib/prisma"

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    })
  } catch {
    return null
  }
}
