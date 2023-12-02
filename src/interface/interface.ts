export type MetricData = {
    name: string
    value: number
    seqnum: number
    metric: string
    type: string
}

export type ResidueData = Record<string, Array<MetricData>>

/**residue_seqnum: data**/
// export type ResidueValues = Record<string, Array<number>>

/**chain_id: data**/
export type ChainData = Record<string, ResidueData>

/**file_name: data**/
export type ModelData = Record<string, ChainData>

export type IrisData = {
    data: ModelData | MultiResultsBinding | any
    chain_list: string[] | undefined | null
    file_list: string[] | undefined | null
}

export type IrisAesthetics = {
    /** Dimensions in array form [width,height] **/
    dimensions: number[]

    /** Radius change between circles **/
    radius_change: number

    /** Header angle (gap at top of the rings) - e.g. 40**/
    header: number

    /** Text size **/
    text_size: number
}

export interface IrisProps {
    from_wasm: boolean
    results: IrisData
    aesthetics: IrisAesthetics
    callback: (residue: string) => void
}

/** Type spec for result bindings - from web assembly**/
export type ResidueResult = {
    /**Name of residue, e.g. GLY**/
    name: string

    /**Calculated metric value**/
    value: number

    /**Sequence Number e.g. 21 **/
    seqnum: number

    /**Name of metric, used as a key and display name**/
    metric: string

    /**Type of data, {continuous or discrete}**/
    type: string
}

/** Type spec for chain result - from web assembly**/
export type ChainResult = {
    /**Chain ID**/
    chain: string

    /**A list of residue results, one for every residue**/
    results: ResidueResult[]

    size: size
}

type size = () => number

/** Type spec for result bindings  - from web assembly**/
export type ResultsBinding = {
    /**A list of chain results, one for every chain**/
    result: ChainResult[]

    /**A list of chain labels for buttons**/
    chain_labels: string[]

    /**Name of the file for display**/
    file_name: string

    /** Size function **/
    size: size
}

/** Type spec for multiple result bindings, i.e.
 *  Two files were given for calculation, both calculations return
 *  a ResultBinding, which is stored here
 *  **/
export type MultiResultsBinding = {
    results: ResultsBinding[]
}

export interface RingData {
    array: Array<number>
    type: string
}

export type MultiRingData = Record<string, RingData>
