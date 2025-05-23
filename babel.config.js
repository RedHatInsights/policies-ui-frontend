require.extensions['.css'] = () => undefined;

module.exports = {
    presets: [ '@babel/env', '@babel/react' ],
    plugins: [
        '@babel/plugin-transform-runtime',
        'lodash',
        [
            'transform-imports',
            {
                '@patternfly/react-icons': {
                    transform: (importName) =>
                        `@patternfly/react-icons/dist/js/icons/${importName
                        .split(/(?=[A-Z])/)
                        .join('-')
                        .toLowerCase()}`,
                    preventFullImport: true
                }
            },
            'react-icons'
        ]
    ]
};
