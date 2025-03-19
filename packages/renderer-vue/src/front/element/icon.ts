import { useElementRenderer } from './renderer';
import { getElementIcon } from '../../icon';
import { ensureElementComponent } from './ensureComponent';

export async function useElementIcon() {
    ensureElementComponent();
    const renderer = useElementRenderer();
    return await getElementIcon(renderer);
}
