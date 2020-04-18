import { style } from 'typestyle';

type RawSpacerTemplate<T> = {
    XS: T;
    SM: T;
    MD: T;
    LG: T;
    XL: T;
    XL_2: T;
    XL_3: T;
    FORM_ELEMENT: T;
};

const RawSpacer: RawSpacerTemplate<number> = {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XL_2: 48,
    XL_3: 64,
    FORM_ELEMENT: 6
};

const RawPaddingTopClassNameSpacer: RawSpacerTemplate<string> = Object.keys(RawSpacer).reduce((spacers, key) => {
    spacers[key] = style({
        paddingTop: RawSpacer[key]
    });
    return spacers;
}, {
    XS: '',
    SM: '',
    MD: '',
    LG: '',
    XL: '',
    XL_2: '',
    XL_3: '',
    FORM_ELEMENT: ''
});

export const Spacer: Readonly<typeof RawSpacer> = RawSpacer;
export const PaddingTopClassNameSpacer: Readonly<typeof RawPaddingTopClassNameSpacer> = RawPaddingTopClassNameSpacer;
