import { spawn } from 'bun';
async function buildAll() {
    console.log("Building all packages and apps...");
    const proc = spawn(['bun', 'tsc', '--build'], {
        cwd: '.',
        stdout: 'inherit',
        stderr: 'inherit',
    });
    await proc.exited;
    if (proc.exitCode !== 0) {
        console.error("Failed to build all packages and apps.");
        process.exit(1);
    }
    console.log("All packages and apps built successfully!");
}
buildAll().catch(console.error);
