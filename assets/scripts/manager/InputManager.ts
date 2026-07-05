import { input, InputEventType, KeyCode } from 'cc';
import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * InputManager
 * 统一输入管理层，接管所有键盘/手柄/摇杆输入
 * Player 不再直接监听键盘，统一从此处查询输入状态
 * 后续扩展手机摇杆、手柄时只需在此处适配
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

    private keyW: boolean = false;
    private keyA: boolean = false;
    private keyS: boolean = false;
    private keyD: boolean = false;

    init(): void {
        input.on(InputEventType.KEY_DOWN, this.onKeyDown, this);
        input.on(InputEventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: { keyCode: number }): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.keyW = true;
                break;
            case KeyCode.KEY_A:
                this.keyA = true;
                break;
            case KeyCode.KEY_S:
                this.keyS = true;
                break;
            case KeyCode.KEY_D:
                this.keyD = true;
                break;
        }
    }

    private onKeyUp(event: { keyCode: number }): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.keyW = false;
                break;
            case KeyCode.KEY_A:
                this.keyA = false;
                break;
            case KeyCode.KEY_S:
                this.keyS = false;
                break;
            case KeyCode.KEY_D:
                this.keyD = false;
                break;
        }
    }

    /**
     * 获取水平输入轴（A=-1, D=+1）
     */
    public getAxisHorizontal(): number {
        let x: number = 0;
        if (this.keyA) { x -= 1; }
        if (this.keyD) { x += 1; }
        return x;
    }

    /**
     * 获取垂直输入轴（S=-1, W=+1）
     */
    public getAxisVertical(): number {
        let y: number = 0;
        if (this.keyS) { y -= 1; }
        if (this.keyW) { y += 1; }
        return y;
    }

    destroy(): void {
        input.off(InputEventType.KEY_DOWN, this.onKeyDown, this);
        input.off(InputEventType.KEY_UP, this.onKeyUp, this);

        this.keyW = false;
        this.keyA = false;
        this.keyS = false;
        this.keyD = false;
    }
}
