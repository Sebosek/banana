import { State } from "./validation.service";

export interface Validation {
    pending: HTMLElement

    fail: HTMLElement
    
    success: HTMLElement

    value: string

    for?: string

    state: State

    run(): State
}