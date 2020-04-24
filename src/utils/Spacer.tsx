type Keys = 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | 'XL_2' | 'XL_3' | 'FORM_ELEMENT';

type RawSpacerTemplate<T> = {
    [key in Keys]: T
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

export const Spacer: Readonly<typeof RawSpacer> = RawSpacer;
