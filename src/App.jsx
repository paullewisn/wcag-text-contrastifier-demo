import React from "react";
import { WCAG_AA, getContrastingTextColour } from "wcag-text-contrastifier";
import styles from "./App.module.css";

function App() {
    const componentToHex = (component) => {
        const hex = component.toString(16).padStart(2, "0");
        return hex.toUpperCase();
    };

    const rgbToHex = (r, g, b) => {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    };

    const generateColour = (start, end, ratio) => {
        return Math.round(start + (end - start) * ratio);
    };

    const generateColours = (startColour, endColour) => {
        const colours = [];
        for (let i = 0; i <= 8; i++) {
            const { r, g, b } = ["r", "g", "b"].reduce((acc, rgb, j) => {
                return {
                    ...acc,
                    [rgb]: generateColour(startColour[j], endColour[j], i / 8),
                };
            }, {});

            const colourHex = rgbToHex(r, g, b);
            colours.push(colourHex);
        }

        colours.shift();
        colours.pop();
        return colours;
    };

    const generateRow = (startColour, midColour, endColour) => [
        ...generateColours(startColour, midColour),
        ...generateColours(midColour, endColour),
    ];

    const rowColours = [
        generateRow([1, 0, 0], [255, 0, 0], [254, 255, 255]),
        generateRow([1, 0, 0], [255, 255, 0], [254, 255, 255]),
        generateRow([0, 1, 0], [0, 255, 0], [255, 254, 255]),
        generateRow([1, 0, 0], [0, 255, 255], [255, 254, 255]),
        generateRow([0, 0, 1], [0, 0, 255], [255, 255, 254]),
        generateRow([0, 0, 1], [255, 0, 255], [255, 255, 254]),
    ];

    const [colour, setColour] = React.useState("#ffffff");
    const [standard, setStandard] = React.useState(WCAG_AA.standard);

    const handleColorChange = (event) => {
        setStandard(event.target.value);
    };


    return (
        <div className={styles.app}>
            <h1>Demo for WCAG Text Contrast {standard}:1</h1>
            <h2>
                Uses{" "}
                <a href="https://www.npmjs.com/package/wcag-text-contrastifier">
                    wcag-text-contrastifier
                </a>
            </h2>
            <h3>
                Contrasts are compliant with the WCAG 2.1 standards for 1.4.3
                Contrast (Minimum) (Level AA)
            </h3>
            <div className={styles.controls}>
                <small>Select standard:</small>
                <input
                    type="radio"
                    id={WCAG_AA[WCAG_AA.standard]}
                    name="contrast"
                    value={WCAG_AA.standard}
                    onChange={handleColorChange}
                    checked={standard+"" === WCAG_AA.standard+""}

                />
                <label htmlFor={WCAG_AA[WCAG_AA.standard]}>Regular Text (4.5:1)</label>
                <input
                    type="radio"
                    id={WCAG_AA[WCAG_AA.largeText]}
                    name="contrast"
                    value={WCAG_AA.largeText}
                    onChange={handleColorChange}
                    checked={standard+"" === WCAG_AA.largeText+""}
                />
                <label htmlFor={WCAG_AA[WCAG_AA.largeText]}>Large Text (3:1)</label>
            </div>
            <div className={styles.grid}>
                {rowColours.map((row) => (
                    <>
                        {row.map((backgroundColor) => (
                            <div
                                key={backgroundColor}
                                className={styles.colourBlockWrapper}
                                style={{
                                    backgroundColor,
                                }}
                                onMouseEnter={() => setColour(backgroundColor)}
                            >
                                <span
                                    style={{
                                        color: getContrastingTextColour(
                                            backgroundColor, standard
                                        ),
                                    }}
                                    className={styles.colourBlock}
                                >
                                    {backgroundColor}
                                </span>
                            </div>
                        ))}
                    </>
                ))}
            </div>
            <br />
            <div className={styles.controls}>
                <small>Enter hex code of background:</small>
                <input
                    type="text"
                    id="hexColor"
                    placeholder="#"
                    maxLength="7"
                    onKeyUp={(evt) => {
                        if (!evt.target.value.startsWith("#")) {
                            evt.target.value = "#" + evt.target.value;
                        }
                        setColour(evt.target.value);
                    }}
                    className={styles.colourInput}
                />
            </div>
            <div
                style={{
                    backgroundColor: colour,
                    color: getContrastingTextColour(colour, standard),
                    fontSize: standard+"" === WCAG_AA.largeText+"" ? "2rem" : "1em",
                    fontWeight: standard+"" === WCAG_AA.largeText+"" ? "bold" : "normal",
                }}
                className={styles.customColour}

            >
                <span>
                    {colour}
                    </span>
            </div>
        </div>
    );
}

export default App;
