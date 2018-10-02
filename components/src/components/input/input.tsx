import { Component, Prop, Element, Event, EventEmitter, Watch } from "@stencil/core";
import { onBlur, onInput } from "./event.helper";

export type state = 'default' | 'success' | 'error'
export type feedback = 'off' | 'error' | 'all'

@Component({
    tag: 'banana-input',
    styleUrl: 'input.css',
    shadow: true
})
export class Input {
    @Prop() label: string
    @Prop() placeholder: string
    @Prop() disabled: boolean
    @Prop() readonly: boolean
    @Prop() name: string
    @Prop({
        reflectToAttr: true
    }) feedback: feedback = 'error'
    @Prop({
        mutable: true
    }) value: string = ""
    @Prop({
        mutable: true,
        reflectToAttr: true
    }) state: state = 'default'

    @Element() host: HTMLElement
    @Event() change: EventEmitter<string>
    
    el: HTMLInputElement
    wrapper: HTMLElement

    get isError() {
        return this.state === 'error' && (this.feedback === 'error' || this.feedback === 'all')
    }

    get isSuccess() {
        return this.state === 'success' && this.feedback === 'all'
    }

    @Watch('state')
    watchState() {
        this.wrapper.classList.toggle('input--success', false)
        this.wrapper.classList.toggle('input--error', false)

        if (this.feedback === 'off') {
            return
        }

        if (this.isSuccess) {
            this.wrapper.classList.toggle('input--success', true)
            return
        }

        if (this.isError) {
            this.wrapper.classList.toggle('input--error', true)
        }
    }
    
    componentDidLoad() {
        if (!!this.el) {
            this.el.addEventListener('blur', this.blurHandler.bind(this))
            this.el.addEventListener('change', this.changeHandler.bind(this))
            this.el.addEventListener('input', this.inputHandler.bind(this))
        }

        this.wrapper.classList.toggle('input--disabled', !!this.disabled)
        this.wrapper.classList.toggle('input--readonly', !!this.readonly)
        this.wrapper.classList.toggle('input--success', this.isSuccess)
        this.wrapper.classList.toggle('input--error', this.isError)
    }

    componentDidUnload() {
        if (!this.el) {
            return
        }

        this.el.removeEventListener('blur', this.blurHandler.bind(this))
        this.el.removeEventListener('change', this.changeHandler.bind(this))
        this.el.removeEventListener('input', this.inputHandler.bind(this))
    }

    clickHandler() {
        this.el.value = ""
        onInput(this.el)
    }

    render() {
        return [<label class="input" ref={(el: HTMLElement) => this.wrapper = el}>
            <div class="input__label">{this.label}</div>
            <div class="input__envelope">
                {/* <div class="input__addon">Addon</div> */}
                {this.renderControl()}
                {this.renderIconClean()}
                {/* <div class="input__addon">Addon</div> */}
            </div>
        </label>,
        <slot></slot>]
    }

    private renderIconClean() {
        const exp = !(this.readonly || this.disabled) && !!this.el && !!this.el.value

        if (exp) {
            return <div class="input__icon" onClick={this.clickHandler.bind(this)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon">
                    <path d='M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z' />
                </svg>
            </div>
        }
    }

    private renderControl() {
        if (this.readonly) {
            return <div class="input__control">{this.value}</div>
        }
        
        return <input class="input__control" ref={(el: HTMLInputElement) => this.el = el} placeholder={this.placeholder} type="text" />
    }

    private inputHandler(ev: UIEvent) {
        const input = ev.srcElement as HTMLInputElement
        if (input) {
            this.value = input.value || ''
        }
    }

    private changeHandler(ev: UIEvent) {
        const x = ev.target as any
            
        this.change.emit(x.value || "")
    }

    private blurHandler() {
        onBlur(this.host)
    }
}