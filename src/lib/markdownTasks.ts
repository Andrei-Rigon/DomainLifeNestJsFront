const TASK_LINE = /^((?:\s*>)*\s*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\](?:\s|$))/;
const FENCE = /^\s*(```|~~~)/;

export function toggleTaskInMarkdown(source: string, taskIndex: number): string {
  const lines = source.split('\n');
  let count = 0;
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(TASK_LINE);
    if (!match) continue;

    if (count === taskIndex) {
      const mark = match[2] === ' ' ? 'x' : ' ';
      lines[i] = line.replace(TASK_LINE, `$1${mark}$3`);
      return lines.join('\n');
    }
    count++;
  }

  return source;
}
