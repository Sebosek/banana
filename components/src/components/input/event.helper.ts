// Those helpers function has to be extracted from the code where they've been used.
// At that place it causes a conflict between an Event in HTML and an Event in Stencil.
// From some reason (don't know why) using an `as` keyword in import didn't help.

export function onBlur(el: HTMLElement) {
    const ev = new Event('blur', { bubbles: true, cancelable: true })
    
    el.dispatchEvent(ev)
}

export function onInput(el: HTMLElement) {
    // little hack: https://github.com/Microsoft/TypeScript/issues/18233
    const opts = { bubbles: true, cancelable: true, composed: true };
    const ev = new Event('input', opts)
    
    el.dispatchEvent(ev)
}