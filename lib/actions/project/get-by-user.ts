import { prisma } from "@/lib/prisma";
import { Project } from "@prisma/client";

export const getProjectsByUser = async (userId: string): Promise<Project[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return projects;

  } catch (error) {
    return [];
  }
};