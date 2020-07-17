import fs from 'fs';

export const patchConfig = (config) => {
    if (!fs.existsSync(config.entry.App)) {
        const withTsx = config.entry.App.replace(/\.[^.]+$/, '.tsx');
        if (fs.existsSync(withTsx)) {
            config.entry.App = withTsx;
        } else {
            console.error(`Entrypoint ${config.entry.App} or ${withTsx} wasn't found`);
        }
    }
};
