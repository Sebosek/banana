import { Component, Prop, Watch, Event, EventEmitter } from "@stencil/core";
import { ValidationService, State } from "./validation.service";
import { Validation } from "./validation.interface";

@Component({
    tag: 'banana-custom-validator',
    styleUrl: 'validation.css',
    shadow: true
})
export class CustomValidator implements Validation {
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

    @Event() activated: EventEmitter

    pending: HTMLElement

    fail: HTMLElement
    
    success: HTMLElement

    run(): State {
        this.activated.emit()
        
        return State.Pending
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