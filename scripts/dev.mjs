import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

const processes = [
  spawn(npmCommand, ['run', 'dev', '-w', 'server'], {
    stdio: 'inherit',
    shell: false,
  }),
  spawn(npmCommand, ['run', 'dev', '-w', 'client'], {
    stdio: 'inherit',
    shell: false,
  }),
];

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) child.kill(isWindows ? undefined : 'SIGTERM');
  }

  process.exit(code);
}

for (const child of processes) {
  child.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) shutdown(code);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
