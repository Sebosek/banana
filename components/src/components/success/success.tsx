import { Component } from "@stencil/core";

@Component({
    tag: 'banana-success',
    styleUrl: 'success.css',
    shadow: true
})
export class Success {
    render() {
        return <span class="validation">
            <slot></slot>
        </span>
    }
}