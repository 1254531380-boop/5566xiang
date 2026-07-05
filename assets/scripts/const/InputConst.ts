/**
 * InputConst
 * 输入相关常量
 * 统一管理触摸、虚拟摇杆、按钮等输入标识
 */
export class InputConst {
    /** 摇杆最大半径（像素） */
    public static readonly JOYSTICK_RADIUS: number = 60;

    /** 摇杆死区（低于此值视为无输入） */
    public static readonly JOYSTICK_DEAD_ZONE: number = 0.1;

    /** 交互按钮点击事件名 */
    public static readonly EVENT_INTERACT: string = 'input_interact';

    /** 摇杆方向变更事件名 */
    public static readonly EVENT_JOYSTICK_MOVE: string = 'input_joystick_move';

    /** 摇杆松开事件名 */
    public static readonly EVENT_JOYSTICK_RELEASE: string = 'input_joystick_release';
}
