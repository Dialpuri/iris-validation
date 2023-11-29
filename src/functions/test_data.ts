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
