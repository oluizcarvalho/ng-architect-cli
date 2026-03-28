import fs from 'fs-extra';
import path from 'path';

export async function createDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, data, { spaces: 2 });
}

export async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest, { overwrite: true });
}
