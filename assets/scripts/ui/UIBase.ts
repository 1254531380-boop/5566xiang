import { _decorator, Component } from 'cc';
import { Logger } from '../core/Logger';

const { ccclass } = _decorator;

/**
 * UIBase
 * UI 组件基类，所有 UI 面板/弹窗应继承此类
 *
 * 架构原则：
 *   - 子类实现 onShow()/onHide() 处理显示/隐藏逻辑
 *   - 通过 show()/hide() 控制 UI 可见性（使用 node.active）
 *   - 不直接调用 Manager，由 System 层或 UIManager 驱动
 *   - 不监听 input.on / Keyboard / Touch
 *
 * 生命周期：
 *   show() → onShow() → (显示中) → hide() → onHide()
 */
@ccclass('UIBase')
export class UIBase extends Component {
    private _isShown: boolean = false;

    /**
     * 显示 UI
     */
    public show(): void {
        if (this._isShown) {
            return;
        }
        this._isShown = true;
        this.node.active = true;
        this.onShow();
        Logger.info(`UIBase: show ${this.node.name}`);
    }

    /**
     * 隐藏 UI
     */
    public hide(): void {
        if (!this._isShown) {
            return;
        }
        this._isShown = false;
        this.onHide();
        this.node.active = false;
        Logger.info(`UIBase: hide ${this.node.name}`);
    }

    /**
     * 是否正在显示
     */
    public isShown(): boolean {
        return this._isShown;
    }

    /**
     * 子类重写：显示时回调（注册 UI 事件、刷新数据等）
     */
    protected onShow(): void {
        // 子类实现
    }

    /**
     * 子类重写：隐藏时回调（注销 UI 事件、清理资源等）
     */
    protected onHide(): void {
        // 子类实现
    }

    onDestroy(): void {
        if (this._isShown) {
            this.onHide();
            this._isShown = false;
        }
        super.onDestroy();
    }
}
