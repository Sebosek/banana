import { Component, Element, Listen } from "@stencil/core";
import { Validation } from "../validations/validation.interface";
import { State as ValidationState } from "../validations/validation.service";

enum State {
    Pristine = 'pristine',
    Passive = 'passive',
    Active = 'active',
    Disable = 'disable'
}

@Component({
    tag: 'banana-validator',
    shadow: true
})
export class Validator {
    private _primary: string[] = [
        'banana-required-validation',
    ]

    private _secondary: string[] = [
        'banana-regex-validation',
        'banana-email-validation',
    ]

    private _validations: Validation[]

    private _state: State = State.Pristine

    private _observer: MutationObserver

    private _control: string

    private _value: string

    @Element() node: HTMLElement

    @Listen('focusin')
    focusHandler() {
        if (this._state === State.Pristine) {
            this._state = State.Passive
            return
        }

        if (this._state === State.Passive) {
            this._state = State.Active
            return
        }
    }

    @Listen('input')
    inputHandler(ev: UIEvent) {
        if (this._state === State.Passive) {
            return
        }

        const control = ev.srcElement as any
        if (this._state === State.Active) {
            this._control = control.name
            this._value = control.value || ''

            this.validating()
        }
    }

    @Listen('change')
    changeHandler(ev: UIEvent) {
        this._state = State.Active

        const control = ev.srcElement as any
        this._control = control.name
        this._value = control.value || ''

        this.validating()
    }

    @Listen('blur')
    blurHandler(ev: UIEvent) {
        const control = ev.srcElement as any
        this._control = control.name
        this._value = control.value || ''

        this.validating()
    }

    componentDidLoad() {
        const nodes = this.node.querySelectorAll(this._secondary.concat(this._primary).join())

        this._validations = Array.from(nodes).map(el => (el as any) as Validation).filter(el => !!el)

        const config = {attributes: true, childList: true, subtree: true}
        this._observer = new MutationObserver(this.mutationCallback.bind(this))
        this._observer.observe(this.node, config)
    }

    componentDidUnload() {
        this._observer.disconnect()
    }

    render() {
        return <div><slot></slot></div>
    }

    private mutationCallback(mutations: MutationRecord[]) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const nodes = this.node.querySelectorAll(this._secondary.join())
                this._validations = Array.from(nodes).map(el => (el as any) as Validation).filter(el => !!el)

                return
            }

            if (mutation.type === 'attributes') {
                const primary = Array.from(this.node.querySelectorAll('banana-required-validation'))
                let failed = primary.some((el) => el.for === this._control && el.state === 'fail')
                if (failed) {
                    return
                }

                const secondary = Array.from(this.node.querySelectorAll(this._secondary.join()))
                secondary.map((el) => (el as any) as Validation).filter((v) => v.for === this._control).forEach((el) => {
                    el.value = this._value
                    el.state = ValidationState.Running
                })
            }
        })
    }

    private validating() {
        this._validations.forEach((v: Validation) => {
            if (this._control !== v.for) {
                return
            }

            const element = (v as any) as HTMLElement
            if (element.tagName === 'BANANA-REQUIRED-VALIDATION') {
                v.value = this._value
                v.state = ValidationState.Running
            } else {
                v.state = ValidationState.Pristine
            }
        })
    }
}