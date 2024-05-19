import { ReactNode } from "react"
import { Message, Tooltip, Whisper, toaster } from "rsuite"


export const successToast = (msg: string) => {
    toaster.push(<Message showIcon type={"success"} closable>
        {msg}
    </Message>, { placement: "bottomStart", duration: 3000 })
}
export const toolTip = (msg: string, children: ReactNode) => (<Whisper followCursor speaker={<Tooltip>{msg}</Tooltip>}>
    <div className="flex justify-center">
        {children}
    </div>
</Whisper>)

