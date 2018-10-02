import { Component, Prop, Watch } from "@stencil/core";
import { ValidationService, State } from "./validation.service";
import { Validation } from "./validation.interface";

@Component({
    tag: 'banana-regex-validation',
    styleUrl: 'validation.css',
    shadow: true
})
export class RegexValidator implements Validation {
    private _service: ValidationService

    @Prop({ 
        reflectToAttr: true, 
        mutable: true 
    }) state: State = State.Pristine
    @Prop({
        reflectToAttr: true
    }) value: string
    @Prop({
        reflectToAttr: true
    }) for: string
    @Prop({
        reflectToAttr: true
    }) regex: string

    pending: HTMLElement

    fail: HTMLElement
    
    success: HTMLElement

    run(): State {
        console.log(`Regex validation; value ${this.value} and RegEx ${this.regex}`)
        if (!!this.value && !!this.regex) {
            const re = new RegExp(this.regex);

            if (!re.test(this.value)) {
                return State.Failed
            }
        }
        
        return State.Succeeded
    }

    @Watch('state')
    watchState(newValue: State, oldValue: State) {
        if (newValue === oldValue) {
            return
        }

        this._service.state(newValue)
    }

    componentDidLoad() {
        this._service = new ValidationService(this)
    }

    render() {
        return [
            <div class="validation validation--hide" ref={(el: HTMLElement) => this.pending = el}>
                <slot name="pending" />
            </div>,
            <div class="validation validation--hide" ref={(el: HTMLElement) => this.fail = el}>
                <slot></slot>
            </div>,
            <div class="validation validation--hide" ref={(el: HTMLElement) => this.success = el}>
                <slot name="success" />
            </div>
        ]
    }
}