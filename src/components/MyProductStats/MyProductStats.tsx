import React, { useState } from "react";
import { DataPoint, IDataSlice, useDataView, useExecution } from "@gooddata/sdk-ui";
import { DateFilterHelpers, DateFilterOption } from "@gooddata/sdk-ui-filters";
import { DateDatasets, Product, Revenue } from "../../ldm/full";
import { CalculationType, CalculationSelect } from "./CalculationTypeSelect";

import styles from "./MyProductStats.module.scss";

const parseDataValue = (val: null | string | number) => {
    return typeof val === "string" ? parseInt(val) : val;
};

const calculationFunctions = {
    [CalculationType.MinRevenue]: (slices: IDataSlice[]) => {
        return slices.reduce((minDataPoint: DataPoint | undefined, slice: IDataSlice) => {
            const currentDataPoint = slice.dataPoints()[0];
            if (!minDataPoint) return currentDataPoint;
            const currentValue = parseDataValue(currentDataPoint.rawValue);
            const minValue = parseDataValue(minDataPoint.rawValue);
            if (currentValue === null) return minDataPoint;
            if (minValue === null || currentValue < minValue) return currentDataPoint;
            return minDataPoint;
        }, undefined);
    },

    [CalculationType.MaxRevenue]: (slices: IDataSlice[]) => {
        return slices.reduce((maxDataPoint: DataPoint | undefined, slice: IDataSlice) => {
            const currentDataPoint = slice.dataPoints()[0];
            if (!maxDataPoint) return currentDataPoint;
            const currentValue = parseDataValue(currentDataPoint.rawValue);
            const maxValue = parseDataValue(maxDataPoint.rawValue);
            if (currentValue === null) return maxDataPoint;
            if (maxValue === null || currentValue > maxValue) return currentDataPoint;
            return maxDataPoint;
        }, undefined);
    },
};

interface Props {
    dateFilterOption: DateFilterOption;
}

export const MyProductStats = ({ dateFilterOption }: Props) => {
    const [calculationType, setCalculationType] = useState(CalculationType.MinRevenue);

    const dateFilter = DateFilterHelpers.mapOptionToAfm(dateFilterOption, DateDatasets.Date.ref, false);

    const execution = useExecution({
        filters: [dateFilter],
        seriesBy: [Revenue],
        slicesBy: [Product.Default, DateDatasets.Date.Month.Short],
    });

    const { result } = useDataView({ execution }, [execution?.fingerprint()]);

    const dataSlices = result
        ?.data()
        .slices()
        .toArray();

    const handleCalcTypeChange = (type: string) => {
        setCalculationType(CalculationType[type]);
    };

    const applyCalculation = (slices: IDataSlice[], calculationType: CalculationType) => {
        console.log(calculationType, Object.keys(calculationFunctions));
        const dataPoint: DataPoint | undefined = calculationFunctions[calculationType](slices);
        return dataPoint?.formattedValue() || "N/A";
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.total}>
                {dataSlices ? applyCalculation(dataSlices, calculationType) : "N/A"}
            </div>
            <CalculationSelect onChange={handleCalcTypeChange} value={calculationType} />
        </div>
    );
};
