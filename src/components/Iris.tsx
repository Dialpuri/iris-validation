/**
 * Iris
 *
 * Jordan S. Dialpuri 2023
 */
import ChainSelectionButtons from './ChainSelectionButtons'
import {
    calculate_center_line,
    calculate_poly_line,
    calculate_poly_line_for_circle,
    calculate_text_position,
} from '../functions/circle_functions.js'
import {
    extract_metric_values,
    get_chain_list,
    get_residue_data,
    normalise_data,
    parse_results,
} from '../functions/data_manipulation.js'
import RingKnurling from './RingKnurling'
import React, { useEffect, useState } from 'react'
import { IrisProps, ModelData, MultiRingData, ResidueData } from '../interface/interface.js'

/** Iris
 * ===========
 *  If the data for Iris is calculated through the supplied bindings the props format should be
 * aes: IrisAesthetics = {
 *    dimensions: [1000,1000]
 *    radius_change: 50,
 *    header: 40,
 *    text_size: 12
 * }
 * results: IrisData = {
 *    data: backend_call().results
 *    chain_list: null
 *    file_list: file_list
 * }
 * props = {
 *    from_wasm: true
 *    results: results
 *    aesthetics: aes
 *    callback: (residue) => {
 *       // use residue ID supplied
 *     }
 * }
 * ===========
 * If the data for Iris comes from another source, the input prop format should be
 * aes: IrisAesthetics = {
 *    dimensions: [1000,1000]
 *    radius_change: 50,
 *    header: 40,
 *    text_size: 12
 * }
 * results: IrisData = {
 *    data: DATA,
 *    chain_list: CHAINLIST
 *    file_list: FILELIST
 * }
 * props = {
 *    from_wasm: false
 *    results: results
 *    aesthetics: aes
 *    callback: (residue) => {
 *       // use residue ID supplied
 *     }
 * }
 * ============
 * **/
export default function Iris(props: IrisProps) {
    const center = [500, 500]
    const max_radius = 490

    const [residueData, setResidueData] = useState<Array<any>>()
    const [selectedResidue, setSelectedResidue] = useState()
    const [combinedData, setCombinedData] = useState<ModelData>()

    const [chainListSet, setChainListSet] = useState(false)
    const [chainList, setChainList] = useState<Array<string>>([''])
    const [selectedChain, setSelectedChain] = useState<string>('')

    const [fileList, setFileList] = useState<Array<string>>([''])
    const [selectedFile, setSelectedFile] = useState<string>('')

    const [dataLength, setDataLength] = useState<number>()

    const [rings, setRings] = useState<Array<any>>()

    const [centerLinePoints, setCenterLinePoints] = useState<string>()

    const [ringTextData, setRingTextData] = useState<Array<Array<any>>>()

    const colours = [
        { fill: '#FF8B85', stroke: '#FF8B85' },
        { fill: '#F5AF00', stroke: '#F5AF00' },
        { fill: '#72C0A6', stroke: '#72C0A6' },
        { fill: '#9FB0D0', stroke: '#9FB0D0' },
        { fill: '#9A8ABC', stroke: '#9A8ABC' },
    ]

    function get_current_residue(angle: number) {
        if (residueData) {
            const gap = residueData.length / 320
            const delta_angle = angle - 20

            let index = Math.floor(delta_angle * gap)

            if (angle == 340) {
                index = residueData.length - 1
            }

            setSelectedResidue(residueData[index])
            return residueData[index]
        }
    }

    /** Initialisation hook **/
    useEffect(() => {
        // console.log(props)
        if (props.from_wasm) {
            const data = parse_results(props.results.data)
            setCombinedData(data)

            let chain_list
            if (!props.results.chain_list) {
                chain_list = get_chain_list(props.results.data)
            } else {
                chain_list = props.results.chain_list
            }
            setChainListSet(true)
            setChainList(chain_list)
            setSelectedChain(chain_list[0])

            if (!props.results.file_list) {
                setFileList(Object.keys(data))
                setSelectedFile(Object.keys(data)[0])
            } else {
                setFileList(props.results.file_list)
                setSelectedFile(props.results.file_list[0])
            }

            return
        }
        if (props.results.data) {
            if (!props.results.chain_list || !props.results.file_list) {
                console.log('If you are supplying data as a prop, it must also supply the chain and file lists')
                return
            }
            const data: ModelData = props.results.data
            const chain_list: string[] = props.results.chain_list
            const file_list: string[] = props.results.file_list

            setCombinedData(data)
            setChainListSet(true)
            setChainList(chain_list)
            setSelectedChain(chain_list[0])
            setFileList(file_list)
            setSelectedFile(file_list[0])
        }
    }, [props.from_wasm, props.results])

    /**Rerender rings when the selected chain or selected file changes**/
    useEffect(() => {
        // Check for null
        if (!combinedData) return
        if (!selectedChain) return

        // Check for new chain lists
        const new_file_chains: string[] = Object.keys(combinedData[selectedFile])
        setChainList(new_file_chains)
        for (const chain in new_file_chains) {
            if (new_file_chains[chain] == selectedChain) {
                setSelectedChain(new_file_chains[chain])
                break
            } else {
                setSelectedChain(new_file_chains[0])
            }
        }

        const current_chain_data: ResidueData = combinedData[selectedFile][selectedChain]
        if (!current_chain_data) return

        const metrics: MultiRingData = extract_metric_values(current_chain_data)

        let current_radius = max_radius - props.aesthetics.radius_change

        const current_rings = []
        const current_ring_text = []
        let dataLength = 0

        for (const metric in metrics) {
            const normalised = normalise_data(metrics[metric].array)
            const polyline = calculate_poly_line(center, current_radius, normalised, props.aesthetics.header)

            const center_ring = calculate_poly_line_for_circle(center, current_radius, props.aesthetics.header)
            const points = polyline + center_ring

            const residue_data: string[] = get_residue_data(current_chain_data)
            setResidueData(residue_data)

            const ring_text_pos = calculate_text_position(center, metric, current_radius, props.aesthetics.text_size)
            current_ring_text.push([...ring_text_pos, metric])

            current_rings.push(points)
            current_radius -= props.aesthetics.radius_change

            dataLength = normalised.length
        }
        setDataLength(dataLength)
        setRings(current_rings)
        setRingTextData(current_ring_text)
    }, [selectedChain, selectedFile])

    function handle_mouse_move(e: any, click: boolean) {
        const svg = document.querySelector('#svg rect') as any
        if (!svg) return

        const pt = new DOMPoint()
        pt.x = e.clientX
        pt.y = e.clientY

        const point = pt.matrixTransform(svg.getScreenCTM().inverse())
        const x = point.x
        const y = point.y

        const delta_x = x - center[0]
        const delta_y = y - center[1]

        let angle = (180 / Math.PI) * Math.atan2(delta_y, delta_x) + 90

        if (angle > 0 && angle < props.aesthetics.header / 2) {
            angle = props.aesthetics.header / 2
        }

        if (-props.aesthetics.header / 2 < angle && angle < 0) {
            angle = 340
        }

        // normalise angles
        if (angle < 0) {
            angle += 360
        }

        const center_line = calculate_center_line(center, angle, max_radius)
        setCenterLinePoints(center_line)

        const residue = get_current_residue(angle)

        if (click) {
            props.callback(`${selectedChain}/${residue}`)
        }
    }

    const chainSelectionButtonsProps = {
        chainList: chainList,
        chainListSet: chainListSet,
        selectedChain: selectedChain,
        setSelectedChain: setSelectedChain,
    }

    const ringKurnlingProps = {
        center: center,
        header: props.aesthetics.header,
        radius: max_radius,
        number: dataLength ? dataLength : 0,
    }

    return (
        <div className='flex-col'>
            <div className='flex h-12 text-center align-middle justify-center'>
                <span className='text-xl h-full align-middle text-center mr-2 my-2'>Chain</span>
                <ChainSelectionButtons {...chainSelectionButtonsProps} />

                <span className='text-xl text-white ml-16 my-2 w-64'>Residue: {selectedResidue}</span>

                {fileList.length > 1 ? (
                    <div className='flex align-middle h-6 my-auto'>
                        <span className='mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 text-ellipsis overflow-hidden'>
                            {fileList[0]}
                        </span>

                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                value=''
                                className='sr-only peer'
                                onClick={() => {
                                    if (fileList[0] == selectedFile) {
                                        setSelectedFile(fileList[1])
                                    } else {
                                        setSelectedFile(fileList[0])
                                    }
                                }}
                            />
                            <div className="w-11 h-6 bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>

                        <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 text-ellipsis overflow-hidden'>
                            {fileList[1]}
                        </span>
                    </div>
                ) : (
                    <></>
                )}
            </div>

            <svg
                id='svg'
                xmlns='http://www.w3.org/2000/svg'
                version='1.1'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                width={props.aesthetics.dimensions[0]}
                height={props.aesthetics.dimensions[1]}
                viewBox={`0 0 1000 1000`}
                onMouseMove={(e) => {
                    handle_mouse_move(e, false)
                }}
                onClick={(e) => {
                    handle_mouse_move(e, true)
                }}
                className='mx-auto'
            >
                <rect id='bounding_rect' x={0} y={0} width={1000} height={1000} fillOpacity={0}></rect>
                <RingKnurling {...ringKurnlingProps} />

                {ringTextData ? (
                    ringTextData.map((item, index) => {
                        return (
                            <text
                                x={item[0]}
                                y={item[1]}
                                fill='gray'
                                key={index}
                                textLength={props.aesthetics.text_size}>
                                {item[2]}
                            </text>
                        )
                    })
                ) : (
                    <></>
                )}

                {rings ? (
                    rings.map((item, index) => {
                        return (
                            <polyline
                                points={item}
                                fill={colours[index].fill}
                                strokeWidth='1'
                                stroke={colours[index].stroke}
                                fillOpacity={0.2}
                                fillRule='evenodd'
                                key={index}
                            />
                        )
                    })
                ) : (
                    <>No rings</>
                )}

                <polyline points={centerLinePoints} fill='gray' strokeWidth='1' stroke='gray' />
            </svg>
        </div>
    )
}
