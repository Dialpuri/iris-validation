export function normalise_data(arr: Array<number>) {
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    total += arr[i]
  }
  const avg = total / arr.length

  const norm = arr.map((e) => {
    return avg - e
  })
  return norm
}

export interface Metric {
  array: Array<number>
  type: string
}

export function extract_metric_values(results: any) {
  const metrics: Record<string, Metric> = {}

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

export function parse_results(results: any) {
  const data: Record<string, Record<string, Record<string, Array<number>>>> = {}

  for (let result_index = 0; result_index < results.size(); result_index++) {
    const result_info = results.get(result_index)
    const result = result_info.result
    data[result_info.file_name] = {}
    for (let i = 0; i < result.size(); i++) {
      const chain_info = result.get(i)
      const chain_name = chain_info.chain
      const results = chain_info.results
      const chain_data: Record<string, Array<number>> = {}
      for (let j = 0; j < results.size(); j++) {
        const residue_result = results.get(j)
        if (residue_result.seqnum in chain_data) {
          chain_data[residue_result.seqnum].push(residue_result)
        } else {
          chain_data[residue_result.seqnum] = [residue_result]
        }
      }

      data[result_info.file_name][chain_name] = chain_data
    }
  }

  return data
}

export function get_residue_data(results: any) {
  const residue_names = []
  for (const data in results) {
    residue_names.push(`${results[data][0].name}/${results[data][0].seqnum}`)
  }
  return residue_names
}
