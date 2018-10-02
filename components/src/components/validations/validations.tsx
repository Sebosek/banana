import { Component, Element } from "@stencil/core";

@Component({
    tag: 'banana-validations',
    styleUrl: 'validations.css',
    shadow: true
})
export class Validations {
    private _validators: string[] = [
        'banana-required-validation',
        'banana-regex-validation',
        'banana-email-validation',
        'banana-custom-validation',
    ]

    private _observer: MutationObserver

    messages: HTMLElement

    @Element() host: HTMLElement

    componentDidLoad() {
        const config = {attributes: true, childList: true, subtree: true}
        this._observer = new MutationObserver(this.mutationCallback.bind(this))
        this._observer.observe(this.host, config)
    }

    componentDidUnload() {
        this._observer.disconnect()
    }

    render() {
        return <div class="validations validations--error" ref={(el: HTMLElement) => this.messages = el}>
            <slot></slot>
        </div>
    }

    private mutationCallback(mutations: MutationRecord[]) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                const known = this._validators.map((c) => c.toUpperCase()).includes(mutation.target.nodeName)
                if (!known) {
                    return
                } 

                const nodes = Array.from(this.host.querySelectorAll(this._validators.join()))
                const failed = nodes.reduce((prev, current) => {
                    const state = current.getAttribute('state') || 'pristine'
                    if (state === 'fail') {
                        return true
                    }

                    return prev || false
                }, false)

                this.messages.classList.toggle('validations--shown', failed)
            }
        })
    }
}