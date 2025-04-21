import YAML from 'yaml';
import type { ElementMeta } from '@bitran-js/core';

import { indent, parseYAML, tryParseInt } from './utils/str';
import { isPlainObject } from './utils/plainObject';

//
// Parse
//

export function detachMeta(textWithMeta: string): {
    meta: ElementMeta;
    restText: string;
} {
    const result = <ReturnType<typeof detachMeta>>{
        meta: {},
    };

    result.restText = textWithMeta.replace(
        /^{(.*)}\n|^{([\s\S]*?)^}\n/m,
        (match, lineMeta, complexMeta, offset) => {
            if (offset > 0 || match.length === textWithMeta.length)
                return match;

            result.meta = parseMeta(lineMeta ?? complexMeta);

            return '';
        },
    );

    return result;
}

export function parseMeta(textMeta: string): ElementMeta {
    const isComplexMeta = textMeta.includes('\n');

    if (isComplexMeta) {
        try {
            const meta = parseYAML(textMeta);
            if (!isPlainObject(meta))
                throw new Error('Complex meta must be a plain object!');
            return meta;
        } catch (e) {
            return {};
        }
    }

    return parseLineMeta(textMeta);
}

export function parseLineMeta(lineMeta: string): ElementMeta {
    const meta = <ElementMeta>{ classes: [] };

    const tokens = lineMeta.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    for (const token of tokens) {
        const firstSymbol = token.at(0);
        const restToken = token.substring(1);

        switch (firstSymbol) {
            case '#':
                meta.id = restToken;
                break;

            case '.':
                (meta.classes ||= []).push(restToken);
                break;

            case '+':
                meta[restToken] = true;
                break;

            case '-':
                meta[restToken] = false;
                break;

            default:
                const [key, value] = token.split('=');
                if (!key) break;

                if (value !== undefined) {
                    // Remove quotes if present
                    if (value.startsWith('"') && value.endsWith('"')) {
                        meta[key] = value.slice(1, -1);
                    } else {
                        meta[key] = tryParseInt(value);
                    }
                } else {
                    meta[key] = null;
                }
                break;
        }
    }

    if (meta.classes && meta.classes.length === 0) delete meta.classes;
    return meta;
}

//
// Stringify
//

export function stringifyMeta(meta: ElementMeta, complexMetaAllowed: boolean) {
    if (!meta) return '';

    let hasObjectProps = false;
    for (const [key, value] of Object.entries(meta)) {
        if (key === 'id') continue;
        if (key === 'classes') continue;

        if (typeof value === 'object') {
            hasObjectProps = true;
            break;
        }
    }

    if (complexMetaAllowed && hasObjectProps) {
        // Complex meta output

        let output = indent(YAML.stringify(meta, null, 4));
        output = '{\n' + output + '}';

        return output;
    } else {
        // Line meta output

        let output = '';

        if (meta.id) {
            output += `#${meta.id} `;
        }

        if (meta.classes && Array.isArray(meta.classes)) {
            output += meta.classes.map((item) => `.${item}`).join(' ') + ' ';
        }

        for (const [key, value] of Object.entries(meta)) {
            if (key === 'id' || key === 'classes') continue;

            if (typeof value === 'boolean') {
                output += `${value ? '+' : '-'}${key} `;
                continue;
            }

            if (!value) {
                output += `${key} `;
                continue;
            }

            if (typeof value === 'string') {
                output += value.includes(' ')
                    ? `${key}="${value}" `
                    : `${key}=${value} `;
                continue;
            }

            if (typeof value === 'number') {
                output += `${key}=${value} `;
                continue;
            }
        }

        if (!output) return '';

        return `{ ${output}}`;
    }
}
