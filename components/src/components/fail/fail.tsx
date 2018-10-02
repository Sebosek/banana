import { Component } from "@stencil/core";

@Component({
    tag: 'banana-fail',
    styleUrl: 'fail.css',
    shadow: true
})
export class Fail {
    render() {
        return <span class="validation">
            <slot></slot>
        </span>
    }
}