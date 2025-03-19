import { type ElementVueRenderer } from './renderer';

export type CustomPhrases = Record<
    string,
    string | ((...args: any[]) => string)
>;

export interface DefaultPhrases {
    _element_title: string;
}

export type ElementPhrases<T extends CustomPhrases = {}> = DefaultPhrases & T;

export function defineLanguage<T extends CustomPhrases = {}>(
    language: ElementPhrases<T>,
) {
    return language;
}

export function defineLanguages<T extends CustomPhrases = {}>(
    loaders: Record<string, () => Promise<{ default: ElementPhrases<T> }>>,
) {
    return Object.fromEntries(
        Object.entries(loaders).map(([languageCode, loader]) => [
            languageCode,
            async () => (await loader()).default,
        ]),
    );
}

export async function getLanguage(
    renderer: ElementVueRenderer,
    languageCode: string,
) {
    return (await renderer.languages?.[languageCode]?.()) ?? {};
}

export async function createPhraseCaller<T extends CustomPhrases = {}>(
    renderer: ElementVueRenderer,
    languageCode: string,
) {
    let phrases = {
        _element_title: renderer.Node.constructor.name,
    } as ElementPhrases<T>;

    if (renderer.languages?.[languageCode]) {
        const loadedPhrases = await getLanguage(renderer, languageCode);
        phrases = { ...phrases, ...loadedPhrases };
    }

    const caller = (key: keyof ElementPhrases<T>, ...args: any[]): string => {
        const phrase = phrases[key];
        if (!phrase) return `{{ ${String(key)} }}`;
        return typeof phrase === 'function'
            ? (phrase(...args) as string)
            : (phrase as string);
    };

    return caller as (key: keyof ElementPhrases<T>, ...args: any[]) => string;
}
