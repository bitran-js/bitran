import {
    BlockNode,
    InlinerNode,
    type DefineElementSchema,
} from '@bitran-js/core';

import {
    BlockParseFactory,
    InlinerParseFactory,
    ObjBlockParseFactory,
    RegexpInlinerParseFactory,
} from '../../src/parse/parseFactory';
import {
    defineElementTranspiler,
    defineProvideElementTranspiler,
    objToText,
    tryRange,
    type Range,
} from '../../src';
import type { RawObject } from '../../src/utils/RawObject';
import { StringifyFactory } from '../../src/stringify/stringifyFactory';

//
// Block Element: Heading
//

export type HeadingSchema = DefineElementSchema<{
    Meta: {
        throw: boolean;
    };
    ParseData: {
        level: number;
        title: string;
        obj?: boolean;
    };
    Provide: {
        prefix?: string;
        postfix?: string;
    };
}>;

export class HeadingNode extends BlockNode<HeadingSchema> {}

export class HeadingParser extends BlockParseFactory<HeadingSchema> {
    level!: number;
    title!: string;

    override canParse(strBlock: string): boolean {
        const [, strLevel, strTitle] = strBlock.match(/^(#+) (.+)$/m) ?? [];
        if (!strLevel || !strTitle) return false;

        this.level = strLevel.length;
        this.title = strTitle.trim();

        return true;
    }

    override async createParseData(): Promise<HeadingSchema['ParseData']> {
        const { provide: { prefix = '', postfix = '' } = {}, meta } =
            this.payload();

        if (meta.throw) throw new Error('Heading wanted to throw!');

        return {
            level: this.level,
            title: prefix + this.title + postfix,
            obj: false,
        };
    }

    override async alterAutoId() {
        return 'custom-heading:' + this.title;
    }
}

export class ObjHeadingParser extends ObjBlockParseFactory<HeadingSchema> {
    override objName = 'heading';

    override async parseDataFromObj(
        obj: RawObject,
    ): Promise<HeadingSchema['ParseData']> {
        if (!obj.level || !obj.title)
            throw new Error('Invalid heading object!');

        const { provide: { prefix = '', postfix = '' } = {} } = this.payload();

        return {
            level: +obj.level,
            title: prefix + obj.title.trim() + postfix,
            obj: true,
        };
    }
}

export class HeadingStringifier extends StringifyFactory<HeadingSchema> {
    override async stringifyElement() {
        const { parseData } = this.payload();
        if (parseData.obj) {
            const rawObj = { ...parseData };
            delete rawObj.obj;
            return objToText('heading', rawObj);
        } else {
            return `${'#'.repeat(parseData.level)} ${parseData.title}`;
        }
    }
}

export const headingTranspiler = defineElementTranspiler<HeadingSchema>({
    Node: HeadingNode,
    Parsers: [HeadingParser, ObjHeadingParser],
    Stringifier: HeadingStringifier,
    provide: {
        prefix: '[default prefix] ',
        postfix: ' [default postfix]',
    },
});

export const defineHeadingTranspiler =
    defineProvideElementTranspiler<HeadingSchema>({
        Node: HeadingNode,
        Parsers: [HeadingParser, ObjHeadingParser],
        Stringifier: HeadingStringifier,
    });

export const smileHeadingTranspiler = defineHeadingTranspiler({
    prefix: ':) ',
    postfix: ' :(',
});

//
// Inliner Element: Dash
//

export type DashSchema = DefineElementSchema<{}>;

export class DashNode extends InlinerNode<DashSchema> {}

export class DashParser extends InlinerParseFactory<DashSchema> {
    override outlineRanges(text: string): Range[] {
        const dashRanges: Range[] = [];

        for (const match of text.matchAll(/ -- /g)) {
            const start = match.index!;
            const end = start + match[0].length;
            const range = tryRange(start, end);
            if (range) dashRanges.push(range);
        }

        return dashRanges;
    }

    override async createParseData() {
        return undefined;
    }
}

export class DashStringifier extends StringifyFactory<DashSchema> {
    override async stringifyElement() {
        return ' -- ';
    }
}

export const dashTranspiler = defineElementTranspiler<DashSchema>({
    Node: DashNode,
    Parsers: [DashParser],
    Stringifier: DashStringifier,
});

//
// Regexp Inliner Element: Bold
//

export type BoldSchema = DefineElementSchema<{
    ParseData: string;
}>;

export class BoldNode extends InlinerNode<BoldSchema> {}

export class BoldParser extends RegexpInlinerParseFactory<BoldSchema> {
    override regexp = /\*\*(.+?)\*\*/g;

    override async parseDataFromRegexp(match: RegExpExecArray) {
        return match[1]!;
    }
}

export class BoldStringifier extends StringifyFactory<BoldSchema> {
    override async stringifyElement() {
        const { parseData } = this.payload();
        return `**${parseData}**`;
    }
}

export const boldTranspiler = defineElementTranspiler<BoldSchema>({
    Node: BoldNode,
    Parsers: [BoldParser],
    Stringifier: BoldStringifier,
});
