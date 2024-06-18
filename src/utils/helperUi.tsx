import { ReactNode } from "react"
import { Message, Tooltip, Whisper, toaster } from "rsuite"
import { TypeAttributes } from "rsuite/esm/@types/common"


export const successToast = (msg: string) => {
    toaster.push(<Message showIcon type={"success"} closable>
        {msg}
    </Message>, { placement: "bottomStart", duration: 3000 })
}
export const errorToast = (msg: string) => {
    if (msg.includes("Duplicate entry")) {
        msg = "Data sudah ada"
    }
    if (msg === "You don't have enough permission") return
    toaster.push(<Message showIcon type={"warning"} closable>
        {msg}
    </Message>, { placement: "bottomStart", duration: 3000 })
}
export const toolTip = (msg: string, children: ReactNode, placement?: TypeAttributes.Placement | "bottomStart") => (<Whisper placement={placement} followCursor speaker={<Tooltip>{msg}</Tooltip>}>
    <div className="flex justify-center">
        {children}
    </div>
</Whisper>)

