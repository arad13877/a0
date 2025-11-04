import { 
  type Project, 
  type InsertProject,
  type File,
  type InsertFile,
  type Message,
  type InsertMessage
} from "@shared/schema";

export interface IStorage {
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  createFile(file: InsertFile): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
  getFilesByProject(projectId: number): Promise<File[]>;
  updateFile(id: number, content: string): Promise<File | undefined>;
  deleteFile(id: number): Promise<boolean>;

  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByProject(projectId: number): Promise<Message[]>;
  deleteMessagesByProject(projectId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private files: Map<number, File>;
  private messages: Map<number, Message>;
  private projectIdCounter: number;
  private fileIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.projects = new Map();
    this.files = new Map();
    this.messages = new Map();
    this.projectIdCounter = 1;
    this.fileIdCounter = 1;
    this.messageIdCounter = 1;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = {
      id,
      name: insertProject.name,
      description: insertProject.description || null,
      template: insertProject.template || null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateProject(
    id: number,
    updates: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const deleted = this.projects.delete(id);
    if (deleted) {
      Array.from(this.files.values())
        .filter((f) => f.projectId === id)
        .forEach((f) => this.files.delete(f.id));
      Array.from(this.messages.values())
        .filter((m) => m.projectId === id)
        .forEach((m) => this.messages.delete(m.id));
    }
    return deleted;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.fileIdCounter++;
    const file: File = {
      ...insertFile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByProject(projectId: number): Promise<File[]> {
    return Array.from(this.files.values()).filter((f) => f.projectId === projectId);
  }

  async updateFile(id: number, content: string): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;

    const updated = { ...file, content, updatedAt: new Date() };
    this.files.set(id, updated);
    return updated;
  }

  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = {
      ...insertMessage,
      id,
      metadata: insertMessage.metadata || null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByProject(projectId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((m) => m.projectId === projectId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async deleteMessagesByProject(projectId: number): Promise<boolean> {
    const messagesToDelete = Array.from(this.messages.values()).filter(
      (m) => m.projectId === projectId
    );
    messagesToDelete.forEach((m) => this.messages.delete(m.id));
    return true;
  }
}

export const storage = new MemStorage();
