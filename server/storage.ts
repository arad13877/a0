import { 
  type Project, 
  type InsertProject,
  type File,
  type InsertFile,
  type Message,
  type InsertMessage,
  type FileVersion,
  type InsertFileVersion,
  type Test,
  type InsertTest
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

  createFileVersion(version: InsertFileVersion): Promise<FileVersion>;
  getFileVersions(fileId: number): Promise<FileVersion[]>;
  restoreFileVersion(fileId: number, versionId: number): Promise<File | undefined>;

  createTest(test: InsertTest): Promise<Test>;
  getTestsByFile(fileId: number): Promise<Test[]>;
  updateTest(id: number, updates: Partial<InsertTest>): Promise<Test | undefined>;
  deleteTest(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private files: Map<number, File>;
  private messages: Map<number, Message>;
  private fileVersions: Map<number, FileVersion>;
  private tests: Map<number, Test>;
  private projectIdCounter: number;
  private fileIdCounter: number;
  private messageIdCounter: number;
  private versionIdCounter: number;
  private testIdCounter: number;

  constructor() {
    this.projects = new Map();
    this.files = new Map();
    this.messages = new Map();
    this.fileVersions = new Map();
    this.tests = new Map();
    this.projectIdCounter = 1;
    this.fileIdCounter = 1;
    this.messageIdCounter = 1;
    this.versionIdCounter = 1;
    this.testIdCounter = 1;
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

    const versions = Array.from(this.fileVersions.values()).filter(v => v.fileId === id);
    const nextVersion = versions.length + 1;
    
    const versionId = this.versionIdCounter++;
    const version: FileVersion = {
      id: versionId,
      fileId: id,
      content: file.content,
      version: nextVersion,
      createdAt: new Date(),
    };
    this.fileVersions.set(versionId, version);

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

  async createFileVersion(insertVersion: InsertFileVersion): Promise<FileVersion> {
    const id = this.versionIdCounter++;
    const version: FileVersion = {
      ...insertVersion,
      id,
      createdAt: new Date(),
    };
    this.fileVersions.set(id, version);
    return version;
  }

  async getFileVersions(fileId: number): Promise<FileVersion[]> {
    return Array.from(this.fileVersions.values())
      .filter(v => v.fileId === fileId)
      .sort((a, b) => b.version - a.version);
  }

  async restoreFileVersion(fileId: number, versionId: number): Promise<File | undefined> {
    const file = this.files.get(fileId);
    const version = this.fileVersions.get(versionId);
    
    if (!file || !version || version.fileId !== fileId) return undefined;

    const updated = { ...file, content: version.content, updatedAt: new Date() };
    this.files.set(fileId, updated);
    return updated;
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const id = this.testIdCounter++;
    const test: Test = {
      ...insertTest,
      id,
      result: insertTest.result || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tests.set(id, test);
    return test;
  }

  async getTestsByFile(fileId: number): Promise<Test[]> {
    return Array.from(this.tests.values()).filter(t => t.fileId === fileId);
  }

  async updateTest(id: number, updates: Partial<InsertTest>): Promise<Test | undefined> {
    const test = this.tests.get(id);
    if (!test) return undefined;

    const updated = { ...test, ...updates, updatedAt: new Date() };
    this.tests.set(id, updated);
    return updated;
  }

  async deleteTest(id: number): Promise<boolean> {
    return this.tests.delete(id);
  }
}

export const storage = new MemStorage();
