import { Injectable, Inject } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import type { Project, ProjectInput } from "@stacklane/shared";
import { StoreService } from "../store/store.service.js";

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(StoreService) private readonly store: StoreService
  ) {}

  list(): Project[] {
    return this.store.getProjects();
  }

  get(id: string): Project | undefined {
    return this.store.getProject(id);
  }

  create(input: ProjectInput): Project {
    const now = new Date().toISOString();
    const project: Project = {
      ...input,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    };
    this.store.addProject(project);
    return project;
  }

  update(id: string, updates: Partial<Project>): Project | null {
    return this.store.updateProject(id, updates);
  }

  delete(id: string): boolean {
    return this.store.deleteProject(id);
  }
}
