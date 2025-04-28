import YAML from 'yaml';

export function normalizeLineEndings(text: string) {
    return text.replace(/\r/gm, '');
}

export function textToStrBlocks(text: string) {
    if (!text) return [];
    return text.trim().split(/\n^\s*\n(?! |\n|})/gm);
}

export function splitFirstLine(text: string) {
    const parts = text.split('\n');

    return {
        firstLine: parts[0],
        restText: parts.slice(1).join('\n'),
    };
}

export function parseYAML(text: string): any {
    return YAML.parse(text);
}

export function stringifyYAML(content: any): string {
    let text = YAML.stringify(content, { indent: 4, lineWidth: 0 });
    // Convert all ways YAML stringify can output multiline strings to just "...: |\n" notation
    text = text.replace(/^(\s*.+): [>|][+-]?\n/gm, '$1: |\n');
    text = text.trim();
    return text;
}

export function toStrObjectBlock(objName: string, content: any) {
    const resolvedContent =
        typeof content === 'string' ? content : stringifyYAML(content);
    return `@${objName}\n${indent(resolvedContent)}`;
}

export function indent(text: string, indentSize = 4): string {
    return text.replace(/^(.+)$/gm, (match, group) => {
        return group.trim() ? ' '.repeat(indentSize) + group : match;
    });
}

export function dedent(text: string): string {
    if (!text) return '';

    const lines = text.split('\n');

    // Find the indentation of the first non-empty line
    let indent = 0;
    for (const line of lines) {
        if (line.trim()) {
            indent = line.length - line.trimStart().length;
            break;
        }
    }

    // If no indentation, return the original text
    if (indent === 0) return text;

    // Remove indentation from all lines
    return lines
        .map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return line; // Keep empty lines as is

            const currentIndent = line.length - line.trimStart().length;
            if (currentIndent >= indent) {
                return line.substring(indent); // Remove the exact indent amount
            } else {
                return trimmed; // Remove all spaces if less than indent amount
            }
        })
        .join('\n');
}

export function tryParseInt(text: string) {
    const parsedInt = parseInt(text);
    return Number.isNaN(parsedInt) ? text : parsedInt;
}
