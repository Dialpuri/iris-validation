import { ModelData, ChainData, ResidueData, MetricData } from '../interface/interface'
export function generate_random_data(metrics: number) {
    const data: ModelData = {}

    const chain_labels = ['A', 'B', 'C', 'D', 'E']
    const chains = 2 + Math.floor(Math.random() * 4)
    const residues = 100 + Math.floor(Math.random() * 300)
    const amino_acids = [
        'ALA',
        'ARG',
        'ASN',
        'ASP',
        'CYS',
        'GLU',
        'GLN',
        'GLY',
        'HIS',
        'ILE',
        'LEU',
        'LYS',
        'MET',
        'PHE',
        'PRO',
        'SER',
        'THR',
        'TRP',
        'TYR',
        'VAL',
    ]
    let chain_data: ChainData = {}
    for (let i = 0; i < chains; i++) {

        let residue_data: ResidueData = {}
        for (let j = 0; j < residues; j++) {

            const metric_list = []
            for (let k = 0; k < metrics; k++) {
                const metric_data = {
                    name: Math.floor(Math.random() * amino_acids.length).toString(),
                    value: Math.random() * 40,
                    seqnum: j,
                    metric: `Metric ${k}`,
                    type: 'continuous',
                }
                metric_list.push(metric_data)
            }
            const r_key = j.toString()
            residue_data[r_key] = metric_list
        }
        const c_key = chain_labels[i]
        chain_data[c_key] = residue_data 
    }

    data["input1"] = chain_data

    return data
}

export function generate_test_data(length: number, amplitude: number) {
    const arr = Array.from({ length: length }, () => Math.random() * amplitude)
    let total = 0
    for (let i = 0; i < arr.length; i++) {
        total += arr[i]
    }
    const avg = total / arr.length

    const norm = arr.map((e) => {
        return -e - avg
    })
    return norm
}
