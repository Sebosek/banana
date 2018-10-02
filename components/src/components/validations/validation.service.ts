import { Validation } from "./validation.interface";
import { typestate } from "typestate";

export enum State {
    Pristine = 'pristine',
    Running = 'running',
    Failed = 'fail',
    Succeeded = 'success',
    Pending = 'pending'
}

export class ValidationService {
    private _component: Validation
    
    private _fsm: typestate.FiniteStateMachine<State>

    protected get fsm(): typestate.FiniteStateMachine<State> {
        return this._fsm
    }

    constructor(component: Validation) {
        this._component = component

        this._fsm = new typestate.FiniteStateMachine<State>(State.Pristine)
        this._fsm.from(State.Pristine).to(State.Running)
        this._fsm.from(State.Pristine).to(State.Succeeded)
        this._fsm.from(State.Pristine).to(State.Failed)
        this._fsm.from(State.Pristine).to(State.Pending)
        this._fsm.from(State.Running).to(State.Failed)
        this._fsm.from(State.Running).to(State.Succeeded)
        this._fsm.from(State.Running).to(State.Pending)
        this._fsm.from(State.Failed).to(State.Pristine)
        this._fsm.from(State.Failed).to(State.Running)
        this._fsm.from(State.Succeeded).to(State.Pristine)
        this._fsm.from(State.Succeeded).to(State.Running)
        this._fsm.from(State.Pending).to(State.Failed)
        this._fsm.from(State.Pending).to(State.Succeeded)
        this._fsm.from(State.Pending).to(State.Running)

        this._fsm.on(State.Pending, () => {
            this._component.pending.classList.toggle('validation--hide', false)
            this._component.fail.classList.toggle('validation--hide', true)
            this._component.success.classList.toggle('validation--hide', true)
            this._component.state = this._fsm.currentState
        })

        this._fsm.on(State.Succeeded, () => {
            this._component.pending.classList.toggle('validation--hide', true)
            this._component.fail.classList.toggle('validation--hide', true)
            this._component.success.classList.toggle('validation--hide', false)
            this._component.state = this._fsm.currentState
        })

        this._fsm.on(State.Failed, () => {
            this._component.pending.classList.toggle('validation--hide', true)
            this._component.fail.classList.toggle('validation--hide', false)
            this._component.success.classList.toggle('validation--hide', true)
            this._component.state = this._fsm.currentState
        })

        this._fsm.on(State.Running, () => {
            this._component.pending.classList.toggle('validation--hide', true)
            this._component.fail.classList.toggle('validation--hide', true)
            this._component.success.classList.toggle('validation--hide', true)
            this._component.state = this._fsm.currentState
            this.run()
        })

        this._fsm.on(State.Pristine, () => {
            this._component.pending.classList.toggle('validation--hide', true)
            this._component.fail.classList.toggle('validation--hide', true)
            this._component.success.classList.toggle('validation--hide', true)
            this._component.state = this._fsm.currentState
        })

        this.state(component.state)
    }

    public state(newState: State) {
        if (!newState) {
            console.warn(`Undefined state of finite state machine for state of ${newState}`)
            return
        }

        if (!this._fsm.canGo(newState)) {
            console.warn(`Transition from ${this._fsm.currentState} to state ${newState} is not possible`)
            return
        }

        this._fsm.go(newState)
    }

    private run() {
        this._fsm.go(this._component.run())
    }
}