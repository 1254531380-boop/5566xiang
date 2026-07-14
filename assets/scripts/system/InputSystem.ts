import { _decorator, Component, find, Button } from 'cc';
import { InputManager } from '../manager/InputManager';
import { MobileUIConst } from '../const/MobileUIConst';
import { Logger } from '../core/Logger';

const { ccclass } = _decorator;

/**
 * InputSystem
 * 场景级输入系统，挂载于 InputRoot 节点下
 * 职责：
 *   1. 绑定交互按钮点击 → InputManager.triggerInteract()
 *   2. 摇杆由 JoystickComponent（同级节点）处理
 *
 * 所有触摸/点击事件在此层处理，Manager 不直接接触 Touch
 */
@ccclass('InputSystem')
export class InputSystem extends Component {
    onLoad(): void {
        this._bindInteractButton();
    }

    /**
     * 绑定交互按钮
     */
    private _bindInteractButton(): void {
        const btnNode = find(MobileUIConst.INTERACT_BUTTON);
        if (btnNode !== null) {
            const button = btnNode.getComponent(Button);
            if (button !== null) {
                button.node.on(Button.EventType.CLICK, this.onInteractClick, this);
                Logger.info('InputSystem: InteractButton bound');
            }
        } else {
            Logger.warn('InputSystem: InteractButton not found');
        }
    }

    /**
     * 交互按钮点击回调
     */
    private onInteractClick(): void {
        InputManager.Instance.triggerInteract();
    }

    onDestroy(): void {
        const btnNode = find(MobileUIConst.INTERACT_BUTTON);
        if (btnNode !== null) {
            const button = btnNode.getComponent(Button);
            if (button !== null) {
                button.node.off(Button.EventType.CLICK, this.onInteractClick, this);
            }
        }
        super.onDestroy();
    }
}
