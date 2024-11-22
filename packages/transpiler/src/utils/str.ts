import YAML from 'yaml';

import type { RawObject } from './RawObject';

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

export function textToObj(text: string): RawObject {
    const fallback = {};

    try {
        const obj = YAML.parse(text);
        return Object.getPrototypeOf(obj) === Object.prototype ? obj : fallback;
    } catch {
        return fallback;
    }
}

export function objToText(objName: string, obj: RawObject) {
    if (Object.keys(obj).length === 0)
        throw new Error('Empty object cannot be converted to text!');

    let strObj = YAML.stringify(obj, { indent: 4 }).trim();
    strObj = strObj.replace(/: \|(-|\+|>)\n/gm, ': |\n'); // Hacky way to bypass all YAML weird "newlines" logic and just use "|" for multiline text
    return `@${objName}\n${indent(strObj)}`;
}

export function indent(text: string, indentSize = 4): string {
    return text.replace(/^(.+)$/gm, (match, group) => {
        return group.trim() ? ' '.repeat(indentSize) + group : match;
    });
}

export function tryParseInt(text: string) {
    const parsedInt = parseInt(text);
    return Number.isNaN(parsedInt) ? text : parsedInt;
}
