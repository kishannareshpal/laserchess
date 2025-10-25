import { Close } from "./close";
import { Content } from "./content";
import { Description } from "./description";
import { Dialog as DialogBase } from "./dialog";
import { Footer } from "./footer";
import { Header } from "./header";
import { Overlay } from "./overlay";
import { Portal } from "./portal";
import { Title } from "./title";
import { Trigger } from "./trigger";

export const Dialog = Object.assign(DialogBase, {
    Close,
    Content,
    Description,
    Footer,
    Header,
    Overlay,
    Portal,
    Title,
    Trigger,
})
