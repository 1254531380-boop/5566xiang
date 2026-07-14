import { _decorator, Component, Node, Vec2, EventTouch } from 'cc';
import { InputManager } from '../manager/InputManager';
import { InputConst } from '../const/InputConst';
import { Logger } from '../core/Logger';

const { ccclass } = _decorator;

/**
 * JoystickComponent
 * 虚拟摇杆组件，挂载于摇杆节点
 * 通过触摸拖拽计算方向，注入到 InputManager
 *
 * 架构原则：
 *   - 只负责触摸 → 方向转换
 *   - 方向注入 InputManager.setJoystickDirection / releaseJoystick
 *   - 不直接操控 Player
 */
@ccclass('JoystickComponent')
export class JoystickComponent extends Component {
    private bgNode: Node | null = null;
    private knobNode: Node | null = null;
    private touchId: number | null = null;
    private bgOriginPos: Vec2 = new Vec2();

    onLoad(): void {
        // 查找子节点
        this.bgNode = this.node.getChildByName('JoystickBg');
        this.knobNode = this.node.getChildByName('JoystickKnob');

        if (this.bgNode === null || this.knobNode === null) {
            Logger.error('JoystickComponent: missing JoystickBg or JoystickKnob child');
            return;
        }

        // 记录底座原始位置
        this.bgOriginPos.set(this.bgNode.position.x, this.bgNode.position.y);

        // 监听触摸
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        if (this.touchId !== null) {
            return;
        }
        this.touchId = event.getID();
        this._updateDirection(event);
    }

    private onTouchMove(event: EventTouch): void {
        if (event.getID() !== this.touchId) {
            return;
        }
        this._updateDirection(event);
    }

    private onTouchEnd(event: EventTouch): void {
        if (event.getID() !== this.touchId) {
            return;
        }
        this.touchId = null;

        // 摇杆归位
        if (this.knobNode !== null) {
            this.knobNode.setPosition(0, 0, 0);
        }
        InputManager.Instance.releaseJoystick();
    }

    private _updateDirection(event: EventTouch): void {
        if (this.bgNode === null || this.knobNode === null) {
            return;
        }

        const touchPos = event.getUILocation();
        const bgWorldPos = this.bgNode.getWorldPosition();

        // 将触摸坐标转换到 bg 节点本地坐标
        const dx: number = touchPos.x - bgWorldPos.x;
        const dy: number = touchPos.y - bgWorldPos.y;
        const dist: number = Math.sqrt(dx * dx + dy * dy);

        const maxRadius: number = InputConst.JOYSTICK_RADIUS;

        if (dist > maxRadius) {
            // 限制在最大半径内
            const scale: number = maxRadius / dist;
            const clampedX: number = dx * scale;
            const clampedY: number = dy * scale;
            this.knobNode.setPosition(clampedX, clampedY, 0);

            InputManager.Instance.setJoystickDirection(dx / dist, dy / dist);
        } else {
            this.knobNode.setPosition(dx, dy, 0);

            if (dist > 0) {
                InputManager.Instance.setJoystickDirection(dx / dist, dy / dist);
            } else {
                InputManager.Instance.releaseJoystick();
            }
        }
    }

    onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        super.onDestroy();
    }
}
