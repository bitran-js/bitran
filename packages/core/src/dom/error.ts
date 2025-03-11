import { BlockNode, InlinerNode } from './element';

export class BlockErrorNode extends BlockNode {
    strBlock!: string;
    error!: any;
}

export class InlinerErrorNode extends InlinerNode {
    strInliner!: string;
    error!: any;
}
