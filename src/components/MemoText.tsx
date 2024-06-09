import { type Signal, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js/types/jsx.d.ts";

type Props = {
    key: string;
    value?: Signal<string>;
    class?: string;
    maxLength?: number;
    onInput?: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent>;
};

export function MemoText(props: Props): JSX.Element {
    const localStorageKey = `MemoText.value(${props.key})`;
    const [getText, setText] = props.value ?? createSignal<string>(localStorage.getItem(localStorageKey) ?? "");

    const handleTextChange: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent> = (e) => {
        const target = e.target as HTMLTextAreaElement;
        setText(target.value.trimStart());
        localStorage.setItem(localStorageKey, target.value);
        if (props.onInput && typeof props.onInput === "function") {
            props.onInput(e);
        }
    };

    onMount(() => {
        const savedText = localStorage.getItem(localStorageKey);
        if (savedText !== null) {
            setText(savedText);
        }
        setInterval(() => {
            if (getText().length === 0) {
                localStorage.removeItem(localStorageKey);
            }
        }, 1000);
    });

    onCleanup(() => {
        localStorage.setItem(localStorageKey, getText());
    });

    return (
        <textarea value={getText()} onInput={handleTextChange} class={props.class} maxLength={props.maxLength ?? ""} />
    );
}
