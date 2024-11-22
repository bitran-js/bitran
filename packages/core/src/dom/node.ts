export abstract class Node {
    parent?: Node;

    get children(): Node[] | undefined {
        return undefined;
    }
}
