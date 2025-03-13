import { createPhraseCaller, type CustomPhrases } from '../../language';
import { injectLanguage } from '../bitranProps';
import { ensureElementComponent } from './ensureComponent';
import { useElementRenderer } from './renderer';

export async function useElementPhrases<T extends CustomPhrases = {}>() {
    ensureElementComponent();
    const renderer = useElementRenderer();
    const language = injectLanguage();
    return await createPhraseCaller<T>(renderer, language || 'en');
}
