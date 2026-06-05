#!/usr/bin/env node
import { type AnalysisResult } from "./rules.js";
type ActionEnv = NodeJS.ProcessEnv;
interface ActionIo {
    write(text: string): void;
}
interface ActionRunResult {
    result: AnalysisResult;
    outputPath: string;
    processExitCode: number;
}
export declare function runAction(env?: ActionEnv, cwd?: string, io?: ActionIo): Promise<ActionRunResult>;
export {};
