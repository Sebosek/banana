import { Component } from "@stencil/core";

@Component({
    tag: 'banana-button',
    styleUrl: 'button.css',
    shadow: true
})
export class Button {
    render() {
        return <button><span><slot></slot></span></button>
    }
}