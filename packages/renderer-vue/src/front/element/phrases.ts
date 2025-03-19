import {
    createPhraseCaller,
    getLanguage,
    type CustomPhrases,
} from '../../language';
import { injectLanguage } from '../bitranProps';
import { ensureElementComponent } from './ensureComponent';
import { useElementRenderer } from './renderer';

export async function useElementPhrases<T extends CustomPhrases = {}>() {
    ensureElementComponent();
    const renderer = useElementRenderer();
    const language = injectLanguage();
    return await createPhraseCaller<T>(renderer, language || 'en');
}

export async function useElementLanguage() {
    ensureElementComponent();
    const renderer = useElementRenderer();
    const language = injectLanguage();
    return await getLanguage(renderer, language || 'en');
}
