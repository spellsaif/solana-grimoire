export interface IDLData {
    address: string
    metadata: {
      name: string
      version: string
      spec: string
      description: string
    }
    instructions: Instruction[]
    accounts: Account[]
    errors: Error[]
    types: Type[]
    constants?: Constant[]
  }
  
  export interface Instruction {
    name: string
    discriminator: number[]
    accounts: InstructionAccount[]
    args: Arg[]
  }
  
  export interface InstructionAccount {
    name: string
    writable?: boolean
    signer?: boolean
    pda?: PDA
    docs?: string[]
    address?: string
  }
  
  export interface PDA {
    seeds: Seed[]
    program?: {
      kind: string
      value: number[]
    }
  }
  
  export interface Seed {
    kind: string
    value?: number[] | string
    path?: string
    account?: string
  }
  
  export interface Arg {
    name: string
    type: string
  }
  
  export interface Account {
    name: string
    discriminator: number[]
  }
  
  export interface Error {
    code: number
    name: string
    msg: string
  }
  
  export interface Type {
    name: string
    type: {
      kind: string
      fields: Field[]
    }
  }
  
  export interface Field {
    name: string
    type:
      | string
      | {
          kind?: string
          vec?: string
          option?: string
        }
  }
  
  export interface Constant {
    name: string
    type: string
    value: string
  }
  
  export interface Node {
    id: string
    name: string
    type: "account" | "instruction" | "program" | "pda" | "token"
    data?: any
  }
  
  export interface Link {
    source: string
    target: string
    type: string
  }
  
  export interface GraphData {
    nodes: Node[]
    links: Link[]
  }
  
  