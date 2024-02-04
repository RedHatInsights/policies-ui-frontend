//@ts-nocheck
import tsImportPluginFactory from 'ts-import-plugin';

const getReactTokenCT = () => tsImportPluginFactory({
    libraryName: '@patternfly/react-tokens',
    libraryDirectory: 'dist/js',
    camel2DashComponentName: false
});

const getReactIconsCT = () => tsImportPluginFactory({
    libraryName: '@patternfly/react-icons',
    libraryDirectory: 'dist/js/icons',
    camel2DashComponentName: true
});

module.exports = {
    updateTsLoaderRule : (rules: Array<any>) => {
        const index = rules.findIndex(rule => rule.loader === 'ts-loader');
        if (index === -1) {
            throw new Error('ts-loader not found');
        }
    
        rules[index].options = {
            ...rules[index].options,
            // Speeds up build, but we lose type checks.
            // This could be enabled if done along with this https://github.com/TypeStrong/ts-loader#transpileonly
            // transpileOnly: true,
            getCustomTransformers: () => ({
                before: [
                    getReactTokenCT(),
                    getReactIconsCT()
                ]
            })
        };
    }
};

// export const updateTsLoaderRule = (rules: Array<any>) => {
//     const index = rules.findIndex(rule => rule.loader === 'ts-loader');
//     if (index === -1) {
//         throw new Error('ts-loader not found');
//     }

//     rules[index].options = {
//         ...rules[index].options,
//         // Speeds up build, but we lose type checks.
//         // This could be enabled if done along with this https://github.com/TypeStrong/ts-loader#transpileonly
//         // transpileOnly: true,
//         getCustomTransformers: () => ({
//             before: [
//                 getReactTokenCT(),
//                 getReactIconsCT()
//             ]
//         })
//     };
// };
