export function roundVolume(diameter, width) {
    const radius = diameter / 2;
    const volume_mm3 = Math.PI * Math.pow(radius, 2) * width;
    const volume_cm3 = volume_mm3 / (1e3); // convert to cm³
    return volume_cm3;
}
export function pipeVolume(outerDiameter, innerDiameter, width) {
    const volume_mm3 = Math.PI * (Math.pow(outerDiameter, 2) - Math.pow(innerDiameter, 2)) / 4 * width;
    const volume_cm3 = volume_mm3 / (1e3); // convert to cm³
    return volume_cm3;
}
export function hexagonPrismVolume(side, width) {
    const area = (3 * Math.sqrt(3) / 2) * Math.pow(side, 2);
    const volume_mm3 = area * width;
    const volume_cm3 = volume_mm3 / (1e3); // convert to cm³
    return volume_cm3;
}
export function sheetVolume(length, height, width) {
    const volume_mm3 = length * width * height;
    const volume_cm3 = volume_mm3 / (1e3); // convert to cm³
    return volume_cm3;
}
//# sourceMappingURL=generate-volume.js.map