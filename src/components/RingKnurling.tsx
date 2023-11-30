/**
 * Ring Knurling
 *
 * Jordan S. Dialpuri 2023
 */
import React from 'react'

export interface RingKnurlingType {
    header: number
    radius: number
    number: number
    center: Array<number>
}

export default function RingKnurling(props: RingKnurlingType) {
    const start_point = props.header / 2
    const range = 360 - props.header

    const points: any[] = []
    const line_length = 10
    // let outer_ring: any[] = []
    // let inner_ring: any[] = []

    for (let i = 0; i <= props.number; i++) {
        const angle = (((i * range) / props.number) + start_point) * (Math.PI / 180)

        const x1 = props.center[0] + props.radius * Math.sin(angle)
        const y1 = props.center[1] - props.radius * Math.cos(angle)

        const x2 = props.center[0] + (props.radius + line_length) * Math.sin(angle)
        const y2 = props.center[1] - (props.radius + line_length) * Math.cos(angle)

        const point = `${x1},${y1} ${x2},${y2}`
        points.push(point)
    }

    return (
        <g>
            {points.map((item: string | undefined, index: number) => {
                return (
                    <polyline points={item} fill='gray' strokeWidth='1' stroke='gray' fillRule='evenodd' key={index} />
                )
            })}

            <circle cx={props.center[0]} cy={props.center[1]} r={props.radius} fill='none' stroke='gray' />
            <circle
                cx={props.center[0]}
                cy={props.center[1]}
                r={props.radius + line_length}
                fill='none'
                stroke='gray'
            />
        </g>
    )
}
