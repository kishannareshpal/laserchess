import { Dialog as DialogBase, Switch } from "@/components/common"

import { CogIcon } from "lucide-react"
import { IconButton } from "../common/icon-button"
import { Row } from "./row"
import { settings$ } from "@/lib/store/settings$"
import { useValue } from "@legendapp/state/react"

export const Dialog = () => {
    const settings = useValue(settings$);

    return (
        <DialogBase>
            <DialogBase.Trigger>
                <IconButton icon={<CogIcon />} />
            </DialogBase.Trigger>

            <DialogBase.Content>
                <DialogBase.Header>
                    <DialogBase.Title>Settings</DialogBase.Title>
                </DialogBase.Header>

                <Row
                    label="Tabletop mode"
                    description="Make player info and controls appear on their side, when this device is placed flat between them (e.g. a tablet / phone)."
                >
                    <Switch checked={settings.tabletopMode} onCheckedChange={(checked) => settings$.toggleTabletopMode(checked)} />
                </Row>
            </DialogBase.Content>
        </DialogBase>
    )
}