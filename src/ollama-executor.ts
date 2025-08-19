import { promisify } from 'util';
import { exec } from "node:child_process";

const execAsync = promisify(exec);
export const runOllama = async (cmd: string, args: string[]) => {
    const { stdout, stderr } = await execAsync(`ollama ${cmd} ${args.join(' ')}`);
    return { stdout, stderr };
}

export const listModels = async () => {
    return fetch("http://localhost:11434/api/tags");
}

export const startOllama = async () => {
  const { stdout, stderr } = await execAsync(`ollama`);
  return { stdout, stderr };
}