/**
 * MobileUIConst
 * 手机端 UI 节点路径常量
 * 所有移动端 UI 节点路径统一在此定义，禁止代码中写死路径
 */
export class MobileUIConst {
    /** InputRoot 节点 */
    public static readonly INPUT_ROOT: string = 'Canvas/InputRoot';

    /** UIRoot 节点 */
    public static readonly UI_ROOT: string = 'Canvas/UIRoot';

    /** 摇杆底座节点 */
    public static readonly JOYSTICK_BG: string = 'Canvas/InputRoot/Joystick/JoystickBg';

    /** 摇杆摇帽节点 */
    public static readonly JOYSTICK_KNOB: string = 'Canvas/InputRoot/Joystick/JoystickKnob';

    /** 交互按钮节点 */
    public static readonly INTERACT_BUTTON: string = 'Canvas/InputRoot/InteractButton';

    /** TopUI 节点 */
    public static readonly TOP_UI: string = 'Canvas/UIRoot/TopUI';

    /** BottomUI 节点 */
    public static readonly BOTTOM_UI: string = 'Canvas/UIRoot/BottomUI';

    /** PopupRoot 节点 */
    public static readonly POPUP_ROOT: string = 'Canvas/UIRoot/PopupRoot';
}
