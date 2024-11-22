import { type ElementVueRenderer } from './renderer';

type Phrases = Record<string, string | ((...args: any[]) => string)>;

export interface ElementPhrases extends Phrases {
    _element_title: string;
}

export function defineLanguage<T extends ElementPhrases = ElementPhrases>(
    language: T,
) {
    return language;
}

export function defineLanguages<T extends ElementPhrases>(
    loaders: Record<string, () => Promise<{ default: T }>>,
) {
    return Object.fromEntries(
        Object.entries(loaders).map(([languageCode, loader]) => [
            languageCode,
            async () => (await loader()).default,
        ]),
    );
}

export async function createPhraseCaller<
    T extends ElementPhrases = ElementPhrases,
>(renderer: ElementVueRenderer, languageCode: string) {
    let phrases = {
        _element_title: renderer.Node.constructor.name,
    } as T;

    if (renderer.languages?.[languageCode]) {
        const loadedPhrases = await renderer.languages[languageCode]();
        phrases = { ...phrases, ...loadedPhrases };
    }

    const caller = (key: keyof T, ...args: any[]): string => {
        const phrase = phrases[key];
        if (!phrase) return `{{ ${String(key)} }}`;
        return typeof phrase === 'function' ? phrase(...args) : phrase;
    };

    return caller as (key: keyof T, ...args: any[]) => string;
}
