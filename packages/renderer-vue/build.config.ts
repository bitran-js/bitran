import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    declaration: true,
    entries: [
        {
            input: 'src',
            loaders: ['js'],
            builder: 'mkdist',
        },
    ],
});
