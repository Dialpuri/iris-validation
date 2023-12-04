# Iris-Validation

[![npm version](https://badge.fury.io/js/iris-validation.svg)](https://badge.fury.io/js/iris-validation)

This repository contains the code for the published npm installable iris-validation package. 

## Installation

To install the published iris-validation 
```
npm install iris-validation@latest
```

## Usage

An example of using the component with the provided random test data  is shown here:
```
import {Iris, IrisData, IrisAesthetics, IrisProps, generate_random_data} from "iris-validation"
import { ExampleProps } from '../interface/interface';

export function Example(props: ExampleProps) {

    const random_data = generate_random_data(5) // get 5 metric rings

    const aes: IrisAesthetics = {
        dimensions: [1000,1000],
        radius_change: 50, 
        header: 40,
        text_size: 12
    }

    const results: IrisData = {
        data: random_data,
        chain_list: ["A", "B", "C"],
        file_list: ["input1"], 
    } // results for use with generate_random_data

    const iris_props: IrisProps = { 
        results: results,
        from_wasm: false,
        aesthetics: aes, 
        callback: (residue) => { 
            console.log("RESIDUE CLICKED", residue)
        }
    }

    return (
            <Iris {...iris_props}></Iris>                        
    );
}
```


## Development

To install this repository
```
  git clone https://github.com/Dialpuri/iris-validation.git
  cd iris-validation
  npm ci
  npm run build
```

Before any commits to this repository the following code must run and pass
```
  npm run prettier
  npm run lint
```

