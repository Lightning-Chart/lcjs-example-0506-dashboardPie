/**
 * LightningChartJS example that showcases series/axes progressing to all kinds of directions inside a dashboard.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    SolidFill,
    ColorRGBA,
    SliceLabelFormatters,
    ColorPalettes,
    AreaSeriesTypes,
    PointShape,
    UIOrigins,
    UIDraggingModes,
    PieChartTypes,
    UIElementBuilders,
    SolidFillPalette
} = lcjs

// Create a 5x2 dashboard.
const grid = lightningChart().Dashboard({
    numberOfRows: 3,
    numberOfColumns: 2
}).setBackgroundFillStyle(new SolidFill().setColor(ColorRGBA(24, 24, 24)))

// Create a legendBox docked to the Dashboard.
const legend = grid.createLegendBoxPanel({
    columnIndex: 1,
    rowIndex: 2,
    columnSpan: 1,
    rowSpan: 1
})

//Pie Chart
{
    //Create a Pie Chart
    const pie = grid.createPieChart(({
        columnIndex: 0,
        rowIndex: 0,
        columnSpan: 1,
        rowSpan : 1, 
        pieChartOptions: { type: PieChartTypes.LabelsOnSides }
    }))
        .setTitle('CPU Usage')
        .setAnimationsEnabled(true)
        .setMultipleSliceExplosion(true)

    // ----- CPU Usage data -----
    const data = [
        { name: 'OS', value: 20 },
        { name: 'Browser', value: 5 },
        { name: 'Video editor', value: 10 },
        { name: 'Unused', value: 65 }
    ]

    // ----- Create Slices -----
    const slices = data.map((item) => pie.addSlice(item.name, item.value))

    // Specify function which generates text for Slice Labels(LabelFormatter).
    pie.setLabelFormatter(SliceLabelFormatters.NamePlusRelativeValue)
    pie.setLabelFont((font) => font.setSize(15))

    // Add Pie chart to LegendBox
    legend.add(pie)
}
// Area Range
{
    // Create a XY Chart.
    const xyChart = grid.createChartXY({
        columnIndex: 1,
        rowIndex: 1,
        columnSpan: 1,
        rowSpan: 1
    })
        .setTitle('Power Consumption')

    // Create palette for use with the System Power Consumption chart.
    const paletteAreaRange = ColorPalettes.arctionWarm(2)
    const solidFills = [0, 1].map(paletteAreaRange).map(color => new SolidFill({ color }))

    // ---- The Area Series both have the same baseline and direction. ----
    // Create semi-transparent blue area to depict the CPU power usage.
    const areaCPU = xyChart.addAreaSeries({ type: AreaSeriesTypes.Positive })
        .setFillStyle(new SolidFill().setColor(ColorRGBA(0, 191, 255, 150)))
        .setStrokeStyle(stroke => stroke.setFillStyle(solidFills[0]))
        .setName('CPU')

    // Create semi-transparent green area to depict the GPU power usage.
    const areaGPU = xyChart.addAreaSeries({ type: AreaSeriesTypes.Positive })
        .setFillStyle(new SolidFill().setColor(ColorRGBA(124, 252, 0, 150)))
        .setStrokeStyle(stroke => stroke.setFillStyle(solidFills[1]))
        .setName('GPU')

    xyChart.getDefaultAxisX()
        .setTitle('Component Load (%)')
    xyChart.getDefaultAxisY()
        .setTitle('Watts')

    const cpuData = [
        { x: 0 },
        { x: 4 },
        { x: 8 },
        { x: 12 },
        { x: 16 },
        { x: 20 },
        { x: 24 },
        { x: 28 },
        { x: 32 },
        { x: 36 },
        { x: 40 },
        { x: 44 },
        { x: 48 },
        { x: 52 },
        { x: 56 },
        { x: 60 },
        { x: 64 },
        { x: 68 },
        { x: 72 },
        { x: 76 },
        { x: 80 },
        { x: 84 },
        { x: 88 },
        { x: 92 },
        { x: 96 },
        { x: 100 }
    ]
    const gpuData = [
        { x: 0 },
        { x: 4 },
        { x: 8 },
        { x: 12 },
        { x: 16 },
        { x: 20 },
        { x: 24 },
        { x: 28 },
        { x: 32 },
        { x: 36 },
        { x: 40 },
        { x: 44 },
        { x: 48 },
        { x: 52 },
        { x: 56 },
        { x: 60 },
        { x: 64 },
        { x: 68 },
        { x: 72 },
        { x: 76 },
        { x: 80 },
        { x: 84 },
        { x: 88 },
        { x: 92 },
        { x: 96 },
        { x: 100 }
    ]

    areaCPU.add(cpuData.map((point) => ({ x: point.x, y: point.x * 3.2 })))
    areaGPU.add(gpuData.map((point) => ({ x: point.x, y: point.x * 2.8 })))

    // Set the custom result table
    areaCPU
        .setResultTableFormatter((builder, series, position, highValue, lowValue) => {
            return builder
                .addRow('CPU')
                .addRow('Power Consumption ' + highValue.toFixed(0) + ' watts')
                .addRow('component load ' + position.toFixed(0) + ' %')
        })
    areaGPU
        .setResultTableFormatter((builder, series, position, highValue, lowValue) => {
            return builder
                .addRow('GPU')
                .addRow('Power Consumption ' + highValue.toFixed(0) + ' watts')
                .addRow('component load ' + position.toFixed(0) + ' %')
        })

    // Add XY Chart to LegendBox
    legend.add(xyChart)

}
// Spider
{
    //Create a Spider Chart
    const chart = grid.createSpiderChart({
        columnIndex: 1,
        rowIndex: 0,
        columnSpan: 1,
        rowSpan: 1
    })
        .setTitle('Average Component Load')
        .setScaleLabelFont((font) => font.setSize(12))
        .setAxisLabelFont((font) => font.setSize(14).setStyle('italic'))

    chart.addSeries(PointShape.Circle)
        .setName('System Load')
        .setFillStyle(new SolidFill().setColor(ColorRGBA(255, 165, 0, 150)))
        .addPoints(
            { axis: 'CPU', value: 10 },
            { axis: 'Memory', value: 10 },
            { axis: 'Network', value: 20 },
            { axis: 'Hard-Drive', value: 40 },
            { axis: 'GPU', value: 20 }
        )
        .setResultTableFormatter((tableContentBuilder, series, value, axis, formatValue) => tableContentBuilder
            .addRow(series.name)
            .addRow(axis)
            .addRow(value + ' %')
        )
    // Add Spider Chart to LegendBox
    legend.add(chart)

}

//Donut Chat
{
    //Create a Donut Chart
    const donut = grid.createPieChart({
        columnIndex: 0, 
        rowIndex: 1,
        columnSpan: 1,
        rowSpan: 2,
        pieChartOptions: { type: PieChartTypes.LabelsOnSides }
    })
        .setTitle('Memory Usage')
        .setAnimationsEnabled(true)
        .setMultipleSliceExplosion(false)
        .setInnerRadius(50)

    // ----- Static data -----
    const data = {
        memory: ['OS', 'Browser', 'Video editor', 'Unused'],
        values: [1000, 692, 2000, 4500]
    }
    // Preparing data for each Slice
    const processedData = [];
    let totalMemoryUse = 0;
    for (let i = 0; i < data.values.length; i++) {
        totalMemoryUse += data.values[i];
        processedData.push({ name: `${data.memory[i]}`, value: data.values[i] });
    }

    // ----- Create fullSpectrum Palette for Donut (defines color of Slice filling) -----
    const palette = SolidFillPalette(ColorPalettes.fullSpectrum, 7)
    donut.setSliceFillStyle(palette)

    // ----- Create Slices -----
    processedData.map((item) => donut.addSlice(item.name, item.value))
    donut.setLabelFormatter(SliceLabelFormatters.NamePlusValue)
    donut.setLabelFont((font) => font.setSize(15))

    //add Donut to Legend Box
    legend.add(donut)

    // ----- Add TextBox below the Donut Chart-----
    donut.addUIElement(UIElementBuilders.TextBox.addStyler(
        textBox =>
            textBox.setFont(fontSettings => fontSettings.setSize(12)).setText(`Total memory : ${totalMemoryUse} MB`)
    )
    )
        .setPosition({ x: 50, y: 10 })
        .setOrigin(UIOrigins.Center)
        .setDraggingMode(UIDraggingModes.notDraggable)
        .setMargin(5)
}

grid.setRowHeight(0, 2)
grid.setColumnWidth(0, 3)
grid.setColumnWidth(1, 2)