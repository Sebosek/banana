import { Prop, Watch } from "@stencil/core";
import { ValidationService, State } from "./validation.service";
import { Validation } from "./validation.interface";

/**
 * Can't be used in inheritence - Stencil bug probably.
 */
export abstract class BaseValidator implements Validation {
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
    
    pending: HTMLElement

    fail: HTMLElement
    
    success: HTMLElement

    abstract run(): State;

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