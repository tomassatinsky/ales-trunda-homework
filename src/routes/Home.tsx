import { DateDatasets, Product, Revenue } from "../ldm/full";
import React, { useState } from "react";

import Page from "../components/Page";
import { DateFilterGranularity } from "@gooddata/sdk-backend-spi";
import { LineChart } from "@gooddata/sdk-ui-charts";
import {
    DateFilter,
    DateFilterHelpers,
    DateFilterOption,
    IDateFilterOptionsByType,
    isAbsoluteDateFilterOption,
    isRelativeDateFilterOption,
} from "@gooddata/sdk-ui-filters";
import { MyProductStats } from "../components/MyProductStats/MyProductStats";

import styles from "./Home.module.scss";

const availableGranularities: DateFilterGranularity[] = ["GDC.time.year"];

const defaultDateFilterOptions: IDateFilterOptionsByType = {
    absolutePreset: [
        {
            from: "2018-01-01",
            to: "2018-12-31",
            name: "Year 2018",
            localIdentifier: "year2018",
            visible: true,
            type: "absolutePreset",
        },
        {
            from: "2019-01-01",
            to: "2019-12-31",
            name: "Year 2019",
            localIdentifier: "year2019",
            visible: true,
            type: "absolutePreset",
        },
        {
            from: "2020-01-01",
            to: "2020-12-31",
            name: "Year 2020",
            localIdentifier: "year2020",
            visible: true,
            type: "absolutePreset",
        },
    ],
    relativeForm: {
        localIdentifier: "RELATIVE_FORM",
        type: "relativeForm",
        granularity: "GDC.time.year",
        from: -2,
        to: -2,
        name: "",
        visible: true,
        availableGranularities,
    },
    relativePreset: {
        "GDC.time.year": [
            {
                from: -1,
                to: -1,
                granularity: "GDC.time.year",
                localIdentifier: "twoYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "1 year ago",
            },
            {
                from: -2,
                to: -2,
                granularity: "GDC.time.year",
                localIdentifier: "threeYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "2 years ago",
            },
            {
                from: -3,
                to: -3,
                granularity: "GDC.time.year",
                localIdentifier: "fourYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "3 years ago",
            },
        ],
    },
};

const Home: React.FC = () => {
    const [dateFilterOption, setDateFilterOption] = useState<DateFilterOption>(
        defaultDateFilterOptions.absolutePreset![2],
    );

    const handleApply = (selectedFilterOption: DateFilterOption) => {
        setDateFilterOption(selectedFilterOption);
    };

    const dateFilter = DateFilterHelpers.mapOptionToAfm(dateFilterOption, DateDatasets.Date.ref, false);

    return (
        <Page>
            <h1>
                My Dashboard{" "}
                {isAbsoluteDateFilterOption(dateFilterOption) &&
                    `${dateFilterOption.from} - ${dateFilterOption.to}`}
                {isRelativeDateFilterOption(dateFilterOption) && dateFilterOption.name}
            </h1>
            <div className={styles.dashboardsDateFilter}>
                <DateFilter
                    selectedFilterOption={dateFilterOption}
                    filterOptions={defaultDateFilterOptions}
                    availableGranularities={availableGranularities}
                    customFilterName="Selected date range"
                    dateFilterMode="active"
                    onApply={handleApply}
                />
            </div>
            <div className={styles.dashboardContent}>
                <div className={styles.dashboardContentChart}>
                    <LineChart
                        filters={dateFilter ? [dateFilter] : []}
                        measures={[Revenue]}
                        segmentBy={Product.Default}
                        trendBy={DateDatasets.Date.Month.Short}
                    />
                </div>
                <div className={styles.dashboardContentCalc}>
                    <MyProductStats dateFilterOption={dateFilterOption} />
                </div>
            </div>
        </Page>
    );
};

export default Home;
