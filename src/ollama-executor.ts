import { promisify } from 'util';
import { exec } from "node:child_process";

const execAsync = promisify(exec);
export const runOllama = async (cmd: string, args: string[]) => {
    const { stdout, stderr } = await execAsync(`ollama ${cmd} ${args.join(' ')}`);
    return { stdout, stderr };
}