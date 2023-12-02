export function calculate_poly_line(center: Array<number>, radius: number, data: Array<number>, header: number) {
    const gap = (360 - header) / (data.length - 1)

    let poly_list = ''

    for (let i = 0; i < data.length; i++) {
        const angle = (header / 2 + gap * i) * (Math.PI / 180)

        if (i == 0) {
            const x = center[0] + radius * Math.sin(angle)
            const y = center[1] - radius * Math.cos(angle)
            poly_list += x
            poly_list += ','
            poly_list += y
            poly_list += ' '
        }

        const x = center[0] + (data[i] + radius) * Math.sin(angle)
        const y = center[1] - (data[i] + radius) * Math.cos(angle)
        poly_list += x
        poly_list += ','
        poly_list += y
        poly_list += ' '

        if (i == data.length - 1) {
            const x = center[0] + radius * Math.sin(angle)
            const y = center[1] - radius * Math.cos(angle)
            poly_list += x
            poly_list += ','
            poly_list += y
            poly_list += ' '
        }
    }
    return poly_list
}
export function calculate_poly_line_for_circle(center: Array<number>, radius: number, header: number) {
    const gap = 360 - header

    let poly_list = ''

    for (let i = gap; i > 0; i--) {
        const angle = (header / 2 + i) * (Math.PI / 180)
        const x = center[0] + radius * Math.sin(angle)
        const y = center[1] - radius * Math.cos(angle)

        if (Number.isNaN(x)) continue
        if (Number.isNaN(y)) continue

        poly_list += x
        poly_list += ','
        poly_list += y
        poly_list += ' '
    }
    return poly_list
}

export function calculate_center_line(center: Array<number>, angle: number, radius: number) {
    angle = angle * (Math.PI / 180)
    const x = center[0] + radius * Math.sin(angle)
    const y = center[1] - radius * Math.cos(angle)
    return `${center[0]},${center[1]} ${x},${y}`
}

export function calculate_text_position(center: Array<number>, text: string, radius: number, text_width: number) {
    return [center[0] - text_width / 2, center[1] - radius + 20]
}
