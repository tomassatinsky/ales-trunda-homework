import React from "react";
import styles from "./MyProductStats.module.scss";

export enum CalculationType {
    MaxRevenue = "MaxRevenue",
    MinRevenue = "MinRevenue",
}

interface Props {
    onChange(value: string): void;
    value: CalculationType;
}

const textMapping = {
    [CalculationType.MaxRevenue]: "Max Revenue",
    [CalculationType.MinRevenue]: "Min Revenue",
};

export const CalculationSelect = ({ onChange, value }: Props) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <select className={styles.calculationSelect} onChange={handleOnChange} value={value}>
            {Object.keys(CalculationType).map(key => (
                <option key={key} value={key}>
                    {textMapping[key]}
                </option>
            ))}
        </select>
    );
};
