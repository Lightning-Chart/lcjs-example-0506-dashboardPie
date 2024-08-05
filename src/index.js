/*
 * LightningChartJS example that showcases series/axes progressing to all kinds of directions inside a dashboard.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    SliceLabelFormatters,
    AreaSeriesTypes,
    PointShape,
    UIOrigins,
    UIDraggingModes,
    PieChartTypes,
    UIElementBuilders,
    emptyFill,
    emptyLine,
    Themes,
} = lcjs

// Create a 5x2 dashboard.
// NOTE: Using `Dashboard` is no longer recommended for new applications. Find latest recommendations here: https://lightningchart.com/js-charts/docs/basic-topics/grouping-charts/
const grid = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        }).Dashboard({
    theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    numberOfRows: 3,
    numberOfColumns: 2,
})

// Create a legendBox docked to the Dashboard.
const legend = grid.createLegendBoxPanel({
    columnIndex: 1,
    rowIndex: 2,
    columnSpan: 1,
    rowSpan: 1,
})

const pieType = window.innerWidth > 850 ? PieChartTypes.LabelsOnSides : PieChartTypes.LabelsInsideSlices

//Pie Chart
{
    //Create a Pie Chart
    const pie = grid
        .createPieChart({
            columnIndex: 0,
            rowIndex: 0,
            columnSpan: 1,
            rowSpan: 1,
            pieOptions: { type: pieType },
        })
        .setTitle('CPU Usage')
        .setMultipleSliceExplosion(true)

    // ----- CPU Usage data -----
    const data = [
        { name: 'OS', value: 20 },
        { name: 'Browser', value: 5 },
        { name: 'Video editor', value: 10 },
        { name: 'Unused', value: 65 },
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
    const xyChart = grid
        .createChartXY({
            columnIndex: 1,
            rowIndex: 1,
            columnSpan: 1,
            rowSpan: 1,
        })
        .setTitle('Power Consumption')

    // ---- The Area Series both have the same baseline and direction. ----
    const areaCPU = xyChart.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' }).setPointFillStyle(emptyFill).setName('CPU')
    const areaGPU = xyChart.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' }).setPointFillStyle(emptyFill).setName('GPU')

    xyChart.getDefaultAxisX().setTitle('Component Load (%)')
    xyChart.getDefaultAxisY().setTitle('Watts')

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
        { x: 100 },
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
        { x: 100 },
    ]

    areaCPU.add(cpuData.map((point) => ({ x: point.x, y: point.x * 3.2 + Math.random() * 9.4 })))
    areaGPU.add(gpuData.map((point) => ({ x: point.x, y: point.x * 2.8 + Math.random() * 6.6 })))

    // Add XY Chart to LegendBox
    legend.add(xyChart)
}
// Spider
{
    //Create a Spider Chart
    const chart = grid
        .createSpiderChart({
            columnIndex: 1,
            rowIndex: 0,
            columnSpan: 1,
            rowSpan: 1,
        })
        .setTitle('Average Component Load')
        .setScaleLabelFont((font) => font.setSize(12))
        .setAxisLabelFont((font) => font.setSize(14).setStyle('italic'))

    chart
        .addSeries()
        .setName('System Load')
        .addPoints(
            { axis: 'CPU', value: 10 },
            { axis: 'Memory', value: 10 },
            { axis: 'Network', value: 20 },
            { axis: 'Hard-Drive', value: 40 },
            { axis: 'GPU', value: 20 },
        )
    // Add Spider Chart to LegendBox
    legend.add(chart)
}

//Donut Chat
{
    //Create a Donut Chart
    const donut = grid
        .createPieChart({
            columnIndex: 0,
            rowIndex: 1,
            columnSpan: 1,
            rowSpan: 2,
            pieOptions: { type: pieType },
        })
        .setTitle('Memory Usage')
        .setMultipleSliceExplosion(false)
        .setInnerRadius(50)

    // ----- Static data -----
    const data = {
        memory: ['OS', 'Browser', 'Video editor', 'Unused'],
        values: [1000, 692, 2000, 4500],
    }
    // Preparing data for each Slice
    const processedData = []
    let totalMemoryUse = 0
    for (let i = 0; i < data.values.length; i++) {
        totalMemoryUse += data.values[i]
        processedData.push({ name: `${data.memory[i]}`, value: data.values[i] })
    }

    // ----- Create Slices -----
    processedData.map((item) => donut.addSlice(item.name, item.value))
    donut.setLabelFormatter(SliceLabelFormatters.NamePlusValue)
    donut.setLabelFont((font) => font.setSize(15))

    //add Donut to Legend Box
    legend.add(donut)

    // ----- Add TextBox below the Donut Chart-----
    donut
        .addUIElement(UIElementBuilders.TextBox)
        .setPosition({ x: 50, y: 10 })
        .setOrigin(UIOrigins.Center)
        .setDraggingMode(UIDraggingModes.notDraggable)
        .setMargin(5)
        .setBackground((background) => background.setFillStyle(emptyFill).setStrokeStyle(emptyLine))
        .setTextFont((fontSettings) => fontSettings.setSize(12))
        .setText(`Total memory : ${totalMemoryUse} MB`)
}

grid.setRowHeight(0, 2)

// Reduce Font size of LegendBoxes.
legend.setLegendBoxes((legendBox) =>
    legendBox.setTitleFont((font) => font.setSize(12)).setEntries((entry) => entry.setTextFont((font) => font.setSize(12))),
)
