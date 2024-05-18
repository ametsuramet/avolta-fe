import { ReactNode } from "react"
import { Message, Tooltip, Whisper, toaster } from "rsuite"


export const successToast = (msg: string) => {
    toaster.push(<Message showIcon type={"success"} closable>
        {msg}
    </Message>, { placement: "bottomStart", duration: 3000 })
}
export const toolTip = (msg: string, children: ReactNode) => (<Whisper followCursor speaker={<Tooltip>{msg}</Tooltip>}>
    <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-green-600 rounded-full mr-2">
        {children}
    </div>
</Whisper>)

