import { Node, EventTarget } from 'cc';
import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';
import { InputConst } from '../const/InputConst';

/**
 * InputManager
 * 统一输入管理层（微信小游戏版）
 *
 * 架构原则：
 *   - Manager 不监听任何 input.on / Keyboard / Mouse / Touch
 *   - 摇杆方向和交互按钮由场景级 InputSystem（Component）注入
 *   - 对外提供 getAxisHorizontal / getAxisVertical 查询接口
 *   - 交互事件通过 EventTarget 派发，业务代码监听 InputConst.EVENT_INTERACT
 *
 * 禁止：
 *   - 业务代码直接调用 input.on()
 *   - Manager 直接监听 Touch / Keyboard / Mouse
 */
export class InputManager extends BaseManager {
    private static _instance: InputManager | null = null;

    public static get Instance(): InputManager {
        if (InputManager._instance === null) {
            InputManager._instance = new InputManager();
            ManagerRegistry.register('InputManager', InputManager._instance);
        }
        return InputManager._instance;
    }

    private constructor() {
        super();
    }

    /** 内部事件派发器 */
    private _eventTarget: EventTarget = new EventTarget();

    /** 摇杆方向（-1 ~ 1） */
    private _axisX: number = 0;
    private _axisY: number = 0;

    init(): void {
        this._axisX = 0;
        this._axisY = 0;
    }

    destroy(): void {
        this._eventTarget.clear();
        this._axisX = 0;
        this._axisY = 0;
    }

    // ==================== 摇杆方向注入（由 InputSystem 调用） ====================

    /**
     * 设置摇杆方向（由 JoystickComponent 调用）
     * @param x 水平方向 -1 ~ 1
     * @param y 垂直方向 -1 ~ 1
     */
    public setJoystickDirection(x: number, y: number): void {
        // 死区处理
        if (Math.abs(x) < InputConst.JOYSTICK_DEAD_ZONE) {
            x = 0;
        }
        if (Math.abs(y) < InputConst.JOYSTICK_DEAD_ZONE) {
            y = 0;
        }
        this._axisX = x;
        this._axisY = y;
    }

    /**
     * 摇杆松开（归零）
     */
    public releaseJoystick(): void {
        this._axisX = 0;
        this._axisY = 0;
    }

    // ==================== 交互事件注入（由 InputSystem 调用） ====================

    /**
     * 触发交互（由 InteractButton 点击调用）
     */
    public triggerInteract(): void {
        this._eventTarget.emit(InputConst.EVENT_INTERACT);
    }

    // ==================== 对外查询接口 ====================

    /**
     * 获取水平输入轴
     */
    public getAxisHorizontal(): number {
        return this._axisX;
    }

    /**
     * 获取垂直输入轴
     */
    public getAxisVertical(): number {
        return this._axisY;
    }

    /**
     * 监听交互事件
     */
    public onInteract(callback: Function, target?: unknown): void {
        this._eventTarget.on(InputConst.EVENT_INTERACT, callback, target);
    }

    /**
     * 取消监听交互事件
     */
    public offInteract(callback: Function, target?: unknown): void {
        this._eventTarget.off(InputConst.EVENT_INTERACT, callback, target);
    }
}
