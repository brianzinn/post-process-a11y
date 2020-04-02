
import React from 'react';
import Select from '@material-ui/core/Select';
import { Vector3, Color3 } from '@babylonjs/core';

export type ColorSpaceRGB = {
    name: string,
    plainEnglish?: string,
    type: string,
    rVec: Vector3,
    gVec: Vector3,
    bVec: Vector3
}

// TODO: include display color spaces with reduced color gamut
export const ColorSpaces: ColorSpaceRGB[] = [
    {
        name: 'Normal',
        type: 'Normal',
        rVec: Vector3.FromArray(Color3.Red().asArray()),
        gVec: Vector3.FromArray(Color3.Green().asArray()),
        bVec: Vector3.FromArray(Color3.Blue().asArray())
    }, {
        name: 'Protanopia',
        plainEnglish: 'red blind',
        type: 'Dichromatic',
        rVec: new Vector3(0.56667, 0.43333, 0),
        gVec: new Vector3(0.55833, 0.44167, 0),
        bVec: new Vector3(0, 0.24167, 0.75833),
    }, {
        name: 'Protanomaly',
        plainEnglish: 'red weak',
        type: 'Anomalous Trichromacy',
        rVec: new Vector3(0.81667, 0.18333, 0),
        gVec: new Vector3(0.33333, 0.66667, 0),
        bVec: new Vector3(0, 0.125, 0.875)
    }, {
        name: 'Deuteranopia',
        plainEnglish: 'green blind',
        type: 'Dichromatic',
        rVec: new Vector3(0.625, 0.375, 0.0),
        gVec: new Vector3(0.7, 0.3, 0.0),
        bVec: new Vector3(0.0, 0.3, 0.7)
    }, {
        name: 'Deuteranomaly',
        plainEnglish: 'green weak',
        type: 'Anomalous Trichromacy',
        rVec: new Vector3(0.80, 0.20, 0),
        gVec: new Vector3(0.25833, 0.74167, 0),
        bVec: new Vector3(0, 0.14167, 0.85833)
    }, {
        name: 'Tritanopia',
        plainEnglish: 'blue blind',
        type: 'Dichromatic',
        rVec: new Vector3(0.95, 0.5, 0),
        gVec: new Vector3(0, 0.43333, 0.56667),
        bVec: new Vector3(0, 0.475, 0.525)
    }, {
        name: 'Tritanomaly',
        plainEnglish: 'blue weak',
        type: 'Anomalous Trichromacy',
        rVec: new Vector3(0.96667, 0.3333, 0),
        gVec: new Vector3(0, 0.73333, 0.26667),
        bVec: new Vector3(0, 0.18333, 0.81667)
    }, {
        name: 'Achromatopsia',
        plainEnglish: 'Monochromacy',
        type: 'Monochromatic',
        rVec: new Vector3(0.299, 0.587, 0.114),
        gVec: new Vector3(0.299, 0.587, 0.114),
        bVec: new Vector3(0.299, 0.587, 0.114)
    }, {
        name: 'Achromatomaly',
        plainEnglish: 'mild Monochromacy',
        type: 'Monochromatic',
        rVec: new Vector3(0.618, 0.32, 0.62),
        gVec: new Vector3(0.163, 0.775, 0.62),
        bVec: new Vector3(0.163, 0.320, 0.516)
    }
]

type ColorSpaceSelectorProps = {
    onColorSpaceSelected: (colorSpaceName: string) => void
};

const ColorSpaceSelector = ({ onColorSpaceSelected }: ColorSpaceSelectorProps) => {
    const handleChange = (event: any /* TODO: find ValueType<T> declaration */) => {
        const colorSpace = event.target.value;
        onColorSpaceSelected(colorSpace);
    }

    return (
        <Select
            native
            defaultValue={'Normal'}
            onChange={handleChange}
            inputProps={{
                name: 'colorSpace',
                id: 'color-space-id',
            }}
        >
            {
                ColorSpaces.map((cs: ColorSpaceRGB) => <option key={`cs-${cs.name}`} value={cs.name}>{cs.name}{cs.plainEnglish ? ` (${cs.plainEnglish})` : ''}</option>)
            }
        </Select>
    )
}

export default ColorSpaceSelector