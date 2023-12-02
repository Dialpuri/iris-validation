import {
    ModelData,
    ResidueData,
    ResultsBinding,
    ChainResult,
    ResidueResult,
    MultiRingData,
} from '../interface/interface.js'

export function normalise_data(arr: Array<number>) {
    let total = 0
    for (let i = 0; i < arr.length; i++) {
        total += arr[i]
    }
    const avg = total / arr.length

    const norm = arr.map((e) => {
        return avg - e
    })

    let norm_total = 0
    for (let i = 0; i < norm.length; i++) {
        norm_total += arr[i]
    }
    const norm_avg = norm_total / norm_total

    const exaggerate = norm.map((e) => {
        if (e > norm_avg) return norm_avg
        return e 
    })

    return exaggerate
}

/**Transform the entire data into an object of format
 * {
 *     metric1: {type: continuous, array: [1, 2, 3]},
 *     metric2: {type: discrete, array: [1, 2, 3]}
 * }
 * **/
export function extract_metric_values(results: any) {
    const metrics: MultiRingData = {}

    for (const data in results) {
        for (let j = 0; j < results[data].length; j++) {
            if (results[data][j].metric in metrics) {
                metrics[results[data][j].metric].array.push(results[data][j].value)
            } else {
                metrics[results[data][j].metric] = { array: [results[data][j].value], type: results[data][j].type }
            }
        }
    }

    return metrics
}

/** Parse results of web assembly bound Iris metric calls
 * Takes in result of WebAssembly, which is effectively a MultiResultsBinding
 * Iterates through the specific web assembly types and puts them into ModelData format
 * This function can be used if the Iris backend is in place, otherwise ModelData can be created in another waty.
 * **/
export function parse_results(results: any): ModelData {
    const data: ModelData = {}

    for (let result_index = 0; result_index < results.size(); result_index++) {
        const result_info: ResultsBinding = results.get(result_index)
        const result: ChainResult[] = result_info.result

        // declare empty ChainData object
        data[result_info.file_name] = {}

        // @ts-ignore
        for (let i = 0; i < result.size(); i++) {
            // @ts-ignore
            const chain_info: ChainResult = result.get(i)
            const chain_name: string = chain_info.chain
            const results: ResidueResult[] = chain_info.results

            const residue_data: ResidueData = {}

            // @ts-ignore
            for (let j = 0; j < results.size(); j++) {
                // @ts-ignore
                const residue_result: ResidueResult = results.get(j)

                if (residue_result.seqnum in residue_data) {
                    residue_data[residue_result.seqnum].push(residue_result)
                } else {
                    residue_data[residue_result.seqnum] = [residue_result]
                }
            }

            data[result_info.file_name][chain_name] = residue_data
        }
    }

    return data
}

/**Get list of residues from the ResidueValues **/
export function get_residue_data(results: ResidueData): string[] {
    const residue_names = []
    for (const data in results) {
        residue_names.push(`${results[data][0].name}/${results[data][0].seqnum}`)
    }
    return residue_names
}

export function get_chain_list(results: any): string[] {
    const chain_list: string[] = []
    // @ts-ignore
    for (let i = 0; i < results.get(0).chain_labels.size(); i++) {
        // @ts-ignore
        chain_list.push(results.get(0).chain_labels.get(i))
    }
    return chain_list
}
